//
//  RNTrackPlayer.swift
//  RNTrackPlayer
//
//  Created by David Chavez on 13.08.17.
//  Copyright © 2017 David Chavez. All rights reserved.
//

import Foundation
import MediaPlayer

@objc(RNTrackPlayer)
public class RNTrackPlayer: RCTEventEmitter, AudioPlayerDelegate {
    private lazy var player: QueuedAudioPlayer = {
        let player = QueuedAudioPlayer()
        player.delegate = self
        
        return player
    }()
    
    
    // MARK: - AudioPlayerDelegate
    
    public func audioPlayer(playerDidChangeState state: AudioPlayerState) {
        guard !isTesting else { return }
        sendEvent(withName: "playback-state", body: ["state": player.playerState.rawValue])
    }
    
    public func audioPlayer(itemPlaybackEndedWithReason reason: PlaybackEndedReason) {
        if reason == .playedUntilEnd && player.nextItems.count == 0 {
            sendEvent(withName: "playback-queue-ended", body: nil)
        } else if reason == .playedUntilEnd {
            sendEvent(withName: "playback-track-changed", body: [
                "track": (player.currentItem as? Track)?.id,
                "position": player.currentTime,
                "nextTrack": (player.nextItems.first as? Track)?.id,
                ])
        }
    }
    
    public func audioPlayer(secondsElapsed seconds: Double) {}
    
    public func audioPlayer(failedWithError error: Error?) {
        guard !isTesting else { return }
        sendEvent(withName: "playback-error", body: ["error": error?.localizedDescription])
    }
    
    public func audioPlayer(seekTo seconds: Int, didFinish: Bool) {}
    
    public func audioPlayer(didUpdateDuration duration: Double) {}
    
    private let isTesting = { () -> Bool in
        if let _ = ProcessInfo.processInfo.environment["XCTestConfigurationFilePath"] {
            return true
        } else if let testingEnv = ProcessInfo.processInfo.environment["DYLD_INSERT_LIBRARIES"] {
            return testingEnv.contains("libXCTTargetBootstrapInject.dylib")
        } else {
            return false
        }
    }()
    
    
    // MARK: - Required Methods
    
    override public static func requiresMainQueueSetup() -> Bool {
        return true;
    }
    
    @objc(constantsToExport)
    override public func constantsToExport() -> [AnyHashable: Any] {
        return [
            "STATE_NONE": AVPlayerWrapperState.idle.rawValue,
            "STATE_PLAYING": AVPlayerWrapperState.playing.rawValue,
            "STATE_PAUSED": AVPlayerWrapperState.paused.rawValue,
            "STATE_STOPPED": AVPlayerWrapperState.idle.rawValue,
            "STATE_BUFFERING": AVPlayerWrapperState.loading.rawValue,
            
            "TRACK_PLAYBACK_ENDED_REASON_END": PlaybackEndedReason.playedUntilEnd.rawValue,
            "TRACK_PLAYBACK_ENDED_REASON_JUMPED": PlaybackEndedReason.jumpedToIndex.rawValue,
            "TRACK_PLAYBACK_ENDED_REASON_NEXT": PlaybackEndedReason.skippedToNext.rawValue,
            "TRACK_PLAYBACK_ENDED_REASON_PREVIOUS": PlaybackEndedReason.skippedToPrevious.rawValue,
            "TRACK_PLAYBACK_ENDED_REASON_STOPPED": PlaybackEndedReason.playerStopped.rawValue,
            
            "PITCH_ALGORITHM_LINEAR": PitchAlgorithm.linear.rawValue,
            "PITCH_ALGORITHM_MUSIC": PitchAlgorithm.music.rawValue,
            "PITCH_ALGORITHM_VOICE": PitchAlgorithm.voice.rawValue,
            
            "CAPABILITY_PLAY": Capability.play.rawValue,
            "CAPABILITY_PLAY_FROM_ID": Capability.unsupported.rawValue,
            "CAPABILITY_PLAY_FROM_SEARCH": Capability.unsupported.rawValue,
            "CAPABILITY_PAUSE": Capability.pause.rawValue,
            "CAPABILITY_STOP": Capability.stop.rawValue,
            "CAPABILITY_SEEK_TO": Capability.unsupported.rawValue,
            "CAPABILITY_SKIP": Capability.unsupported.rawValue,
            "CAPABILITY_SKIP_TO_NEXT": Capability.next.rawValue,
            "CAPABILITY_SKIP_TO_PREVIOUS": Capability.previous.rawValue,
            "CAPABILITY_SET_RATING": Capability.unsupported.rawValue,
            "CAPABILITY_JUMP_FORWARD": Capability.jumpForward.rawValue,
            "CAPABILITY_JUMP_BACKWARD": Capability.jumpBackward.rawValue,
        ]
    }
    
    @objc(supportedEvents)
    override public func supportedEvents() -> [String] {
        return [
            "playback-queue-ended",
            "playback-state",
            "playback-error",
            "playback-track-changed",
            
            "remote-stop",
            "remote-pause",
            "remote-play",
            "remote-next",
            "remote-seek",
            "remote-previous",
            "remote-jump-forward",
            "remote-jump-backward",
        ]
    }
    
    
    // MARK: - Bridged Methods
    
    @objc(setupPlayer:resolver:rejecter:)
    public func setupPlayer(config: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        do {
            try AVAudioSession.sharedInstance().setCategory(.playback, mode: .default)
            try AVAudioSession.sharedInstance().setActive(true)
        } catch {
            reject("setup_audio_session_failed", "Failed to setup audio session", error)
        }
        
        resolve(NSNull())
    }
    
    @objc(destroy)
    public func destroy() {
        print("Destroying player")
    }
    
    @objc(updateOptions:resolver:rejecter:)
    public func update(options: [String: Any], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let remoteCenter = MPRemoteCommandCenter.shared()
        let castedCapabilities = (options["capabilities"] as? [String])
        let supportedCapabilities = castedCapabilities?.filter { Capability(rawValue: $0) != nil }
        let capabilities = supportedCapabilities?.flatMap { Capability(rawValue: $0) } ?? []
        
        let enableStop = capabilities.contains(.stop)
        let enablePause = capabilities.contains(.pause)
        let enablePlay = capabilities.contains(.play)
        let enablePlayNext = capabilities.contains(.next)
        let enablePlayPrevious = capabilities.contains(.previous)
        let enableSkipForward = capabilities.contains(.jumpForward)
        let enableSkipBackward = capabilities.contains(.jumpBackward)
        let enableSeek = capabilities.contains(.seek)
        
        toggleRemoteHandler(command: remoteCenter.stopCommand, selector: #selector(remoteSentStop), enabled: enableStop)
        toggleRemoteHandler(command: remoteCenter.pauseCommand, selector: #selector(remoteSentPause), enabled: enablePause)
        toggleRemoteHandler(command: remoteCenter.playCommand, selector: #selector(remoteSentPlay), enabled: enablePlay)
        toggleRemoteHandler(command: remoteCenter.togglePlayPauseCommand, selector: #selector(remoteSentPlayPause), enabled: enablePause && enablePlay)
        toggleRemoteHandler(command: remoteCenter.nextTrackCommand, selector: #selector(remoteSentNext), enabled: enablePlayNext)
        toggleRemoteHandler(command: remoteCenter.previousTrackCommand, selector: #selector(remoteSentPrevious), enabled: enablePlayPrevious)
        if #available(iOS 9.1, *) {
            toggleRemoteHandler(command: remoteCenter.changePlaybackPositionCommand, selector: #selector(remoteSentSeek), enabled: enableSeek)
        }
        
        
        remoteCenter.skipForwardCommand.preferredIntervals = [options["jumpInterval"] as? NSNumber ?? 15]
        remoteCenter.skipBackwardCommand.preferredIntervals = [options["jumpInterval"] as? NSNumber ?? 15]
        toggleRemoteHandler(command: remoteCenter.skipForwardCommand, selector: #selector(remoteSendSkipForward), enabled: enableSkipForward)
        toggleRemoteHandler(command: remoteCenter.skipBackwardCommand, selector: #selector(remoteSendSkipBackward), enabled: enableSkipBackward)
        
        resolve(NSNull())
    }
    
    @objc(add:before:resolver:rejecter:)
    public func add(trackDicts: [[String: Any]], before trackId: String?, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        var tracks = [Track]()
        for trackDict in trackDicts {
            guard let track = Track(dictionary: trackDict) else {
                reject("invalid_track_object", "Track is missing a required key", nil)
                return
            }
            
            tracks.append(track)
        }
        
        print("Adding tracks:", tracks)
        
        if let trackId = trackId {
            guard let insertIndex = player.queueManager.items.firstIndex(where: { ($0 as! Track).id == trackId })
                else {
                    reject("track_not_in_queue", "Given track ID was not found in queue", nil)
                    return
            }
            
            try? player.add(items: tracks, at: insertIndex)
        } else {
            if (player.currentItem == nil && tracks.count > 0) {
                sendEvent(withName: "playback-track-changed", body: [
                    "track": nil,
                    "position": 0,
                    "nextTrack": tracks.first!.id
                    ])
            }
            
            try? player.add(items: tracks)
        }
        
        resolve(NSNull())
    }
    
    @objc(remove:resolver:rejecter:)
    public func remove(tracks ids: [String], resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Removing tracks:", ids)
        var indexesToRemove: [Int] = []
        
        for id in ids {
            if let index = player.queueManager.items.firstIndex(where: { ($0 as! Track).id == id }) {
                if index == player.queueManager.currentIndex { return }
                indexesToRemove.append(index)
            }
        }
        
        for index in indexesToRemove {
            try? player.removeItem(at: index)
        }
        
        resolve(NSNull())
    }
    
    @objc(removeUpcomingTracks:rejecter:)
    public func removeUpcomingTracks(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Removing upcoming tracks")
        player.removeUpcomingItems()
        resolve(NSNull())
    }
    
    @objc(skip:resolver:rejecter:)
    public func skip(to trackId: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let trackIndex = player.queueManager.items.firstIndex(where: { ($0 as! Track).id == trackId })
            else {
                reject("track_not_in_queue", "Given track ID was not found in queue", nil)
                return
        }
        
        sendEvent(withName: "playback-track-changed", body: [
            "track": (player.currentItem as? Track)?.id,
            "position": player.currentTime,
            "nextTrack": trackId,
            ])
        
        print("Skipping to track:", trackId)
        try? player.jumpToItem(atIndex: trackIndex, playWhenReady: player.playerState == .playing)
        resolve(NSNull())
    }
    
    @objc(skipToNext:rejecter:)
    public func skipToNext(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Skipping to next track")
        do {
            sendEvent(withName: "playback-track-changed", body: [
                "track": (player.currentItem as? Track)?.id,
                "position": player.currentTime,
                "nextTrack": (player.nextItems.first as? Track)?.id,
                ])
            try player.next()
            resolve(NSNull())
        } catch (_) {
            reject("queue_exhausted", "There is no tracks left to play", nil)
        }
    }
    
    @objc(skipToPrevious:rejecter:)
    public func skipToPrevious(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Skipping to next track")
        do {
            sendEvent(withName: "playback-track-changed", body: [
                "track": (player.currentItem as? Track)?.id,
                "position": player.currentTime,
                "nextTrack": (player.previousItems.last as? Track)?.id,
                ])
            try player.previous()
            resolve(NSNull())
        } catch (_) {
            reject("no_previous_track", "There is no previous track", nil)
        }
    }
    
    @objc(reset:rejecter:)
    public func reset(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Resetting player.")
        player.stop()
        resolve(NSNull())
    }
    
    @objc(play:rejecter:)
    public func play(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Starting/Resuming playback")
        try? player.play()
        resolve(NSNull())
    }
    
    @objc(pause:rejecter:)
    public func pause(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Pausing playback")
        try? player.pause()
        resolve(NSNull())
    }
    
    @objc(stop:rejecter:)
    public func stop(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Stopping playback")
        player.stop()
        resolve(NSNull())
    }
    
    @objc(seekTo:resolver:rejecter:)
    public func seek(to time: Double, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Seeking to \(time) seconds")
        try? player.seek(to: time)
        resolve(NSNull())
    }
    
    @objc(setVolume:resolver:rejecter:)
    public func setVolume(level: Float, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Setting volume to \(level)")
        player.volume = level
        resolve(NSNull())
    }
    
    @objc(getVolume:rejecter:)
    public func getVolume(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Getting current volume")
        resolve(player.volume)
    }
    
    @objc(setRate:resolver:rejecter:)
    public func setRate(rate: Float, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Setting rate to \(rate)")
        player.rate = rate
        resolve(NSNull())
    }
    
    @objc(getRate:rejecter:)
    public func getRate(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        print("Getting current rate")
        resolve(player.rate)
    }
    
    @objc(getTrack:resolver:rejecter:)
    public func getTrack(id: String, resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        guard let track = player.queueManager.items.first(where: { ($0 as! Track).id == id })
            else {
                reject("track_not_in_queue", "Given track ID was not found in queue", nil)
                return
        }
        
        resolve((track as? Track)?.toObject())
    }
    
    @objc(getQueue:rejecter:)
    public func getQueue(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        let serializedQueue = player.queueManager.items.map { ($0 as! Track).toObject() }
        resolve(serializedQueue)
    }
    
    @objc(getCurrentTrack:rejecter:)
    public func getCurrentTrack(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve((player.currentItem as? Track)?.id)
    }
    
    @objc(getDuration:rejecter:)
    public func getDuration(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(player.duration)
    }
    
    @objc(getBufferedPosition:rejecter:)
    public func getBufferedPosition(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(0)
    }
    
    @objc(getPosition:rejecter:)
    public func getPosition(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(player.currentTime)
    }
    
    @objc(getState:rejecter:)
    public func getState(resolve: RCTPromiseResolveBlock, reject: RCTPromiseRejectBlock) {
        resolve(player.playerState.rawValue)
    }
    
    
    // MARK: - Private Helpers
    
    private func toggleRemoteHandler(command: MPRemoteCommand, selector: Selector, enabled: Bool) {
        command.removeTarget(self, action: selector)
        command.addTarget(self, action: selector)
        command.isEnabled = enabled
    }
    
    
    // MARK: - Remote Dynamic Methods
    
    @objc func remoteSentStop() {
        sendEvent(withName: "remote-stop", body: nil)
    }
    
    @objc func remoteSentPause() {
        sendEvent(withName: "remote-pause", body: nil)
    }
    
    @objc func remoteSentSeek(event: MPChangePlaybackPositionCommandEvent) {
        sendEvent(withName: "remote-seek", body: ["position": event.positionTime])
    }
    
    @objc func remoteSentPlay() {
        sendEvent(withName: "remote-play", body: nil)
    }
    
    @objc func remoteSentNext() {
        sendEvent(withName: "remote-next", body: nil)
    }
    
    @objc func remoteSentPrevious() {
        sendEvent(withName: "remote-previous", body: nil)
    }
    
    @objc func remoteSendSkipForward(event: MPSkipIntervalCommandEvent) {
        sendEvent(withName: "remote-jump-forward", body: ["interval": event.interval])
    }
    
    @objc func remoteSendSkipBackward(event: MPSkipIntervalCommandEvent) {
        sendEvent(withName: "remote-jump-backward", body: ["interval": event.interval])
    }
    
    @objc func remoteSentPlayPause() {
        if player.playerState == .paused {
            sendEvent(withName: "remote-play", body: nil)
            return
        }
        
        sendEvent(withName: "remote-pause", body: nil)
    }
}
