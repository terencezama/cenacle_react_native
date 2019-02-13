module Fastlane
  module Actions
    module SharedValues
      PATCH_CONFIG_CUSTOM_VALUE = :PATCH_CONFIG_CUSTOM_VALUE
    end

    class PatchConfigAction < Action
      def self.run(params)
        # fastlane will take care of reading in the parameter and fetching the environment variable:
        # UI.message "Parameter API Token: #{params[:api_token]}"

        # sh "shellcommand ./path"
        patchConfigs(params)

        # Actions.lane_context[SharedValues::PATCH_CONFIG_CUSTOM_VALUE] = "my_val"
      end

      def self.patchConfigs(params)
        options         = params[:options]
        if options[:currentDir] != nil
          Dir.chdir(options[:currentDir])
        end

        configs_path    = "./config.json"
        configs_file    = File.read(configs_path)
        configs         = JSON.parse(configs_file)

        configs["env"]     = "prod"
        
        File.write(configs_path,JSON.pretty_generate(configs))

        platform        = 'ios'
        # write to xconfig for ios
        xconfig         = ""
        xconfig         += "VERSION = #{configs[platform]["version"]}\n"
        xconfig         += "BUILDNUMBER = #{configs[platform]["buildNumber"]}\n"
        xconfig         += "APPID = #{configs[platform]["appId"]}\n"
        xconfig         += "APPNAME = #{configs["common"]["appName"]}\n"
        puts xconfig
        # append cocoapod configs
        pod_debug_config    = File.read("ios/Pods/Target\ Support\ Files/Pods-Cenacle/Pods-Cenacle.debug.xcconfig")
        pod_release_config  = File.read("ios/Pods/Target\ Support\ Files/Pods-Cenacle/Pods-Cenacle.release.xcconfig")

        debug_config_path   = "ios/config.debug.xcconfig"
        release_config_path = "ios/config.release.xcconfig"
        File.write(debug_config_path,xconfig)
        File.write(release_config_path,xconfig)
        
        File.write(debug_config_path,pod_debug_config,mode:'a')
        File.write(release_config_path,pod_release_config,mode:'a')



      end
      #####################################################
      # @!group Documentation
      #####################################################
      def self.description
        "A short description with <= 80 characters of what this action does"
      end

      def self.details
        # Optional:
        # this is your chance to provide a more detailed description of this action
        "You can use this action to do cool things..."
      end

      def self.available_options
        # Define all options your action supports. 
        
        # Below a few examples
        [
          # FastlaneCore::ConfigItem.new(key: :api_token,
          #                              env_name: "FL_PATCH_CONFIG_API_TOKEN", # The name of the environment variable
          #                              description: "API Token for PatchConfigAction", # a short description of this parameter
          #                              verify_block: proc do |value|
          #                                 UI.user_error!("No API token for PatchConfigAction given, pass using `api_token: 'token'`") unless (value and not value.empty?)
          #                                 # UI.user_error!("Couldn't find file at path '#{value}'") unless File.exist?(value)
          #                              end),
          FastlaneCore::ConfigItem.new(key: :options,
                                      #  env_name: "FL_PATCH_CONFIG_DEVELOPMENT",
                                       description: "Options",
                                       is_string: false, # true: verifies the input is a string, false: every kind of value
                                      #  default_value: false
                                       ) # the default value if the user didn't provide one
        ]
      end

      def self.output
        # Define the shared values you are going to provide
        # Example
        [
          ['PATCH_CONFIG_CUSTOM_VALUE', 'A description of what this value contains']
        ]
      end

      def self.return_value
        # If your method provides a return value, you can describe here what it does
      end

      def self.authors
        # So no one will ever forget your contribution to fastlane :) You are awesome btw!
        ["Your GitHub/Twitter Name"]
      end

      def self.is_supported?(platform)
        # you can do things like
        # 
        #  true
        # 
        #  platform == :ios
        # 
        #  [:ios, :mac].include?(platform)
        # 

        platform == :ios
      end
    end
  end
end
