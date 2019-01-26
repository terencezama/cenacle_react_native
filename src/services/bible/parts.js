const parts = {
    script: `if (window.Element && !Element.prototype.closest) {
        Element.prototype.closest =
          function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
              i,
              el = this;
            do {
              i = matches.length;
              while (--i >= 0 && matches.item(i) !== el) { };
            } while ((i < 0) && (el = el.parentElement));
            return el;
          };
      }
      var underline = 'underline';
  
      document.addEventListener('message', function (e) {
        messageReceived(e);
      });

      var isClick = false;
      document.addEventListener('touchstart', function (e) {
        // console.log('touchstart',e);
        isClick = true;
      });
      document.addEventListener('touchend', function (e) {
        // console.log('touchend',e);
        if(isClick){
          clickAction(e);
        }
        isClick = false;
      });
      document.addEventListener('touchmove', function (e) {
        // console.log('touchmove',e);
        isClick = false;
      });
      // window.addEventListener('message', function (e) {
      //     messageReceived(e);
      // });
  
      function messageReceived(e) {
        var data = JSON.parse(e.data);
        //data work with actions
        // window.postMessage(data);
        switch (data.action) {
          case "font-change": {
            var delta = parseInt(data.delta);
            document.body.style.fontSize = (parseFloat(document.body.style.fontSize) + delta) + "px";
            break;
          }
          case "clear-underline": {
            var underlines = document.getElementsByClassName("underline")
            while (underlines[0]) {
              underlines[0].classList.remove('underline');
            }
            break;
          }
          case "highlight": {
            var verses = data.verses;
            var underlines = document.getElementsByClassName("underline")
            while (underlines[0]) {
              underlines[0].classList.add('highlight');
              underlines[0].classList.remove('underline');
            }
            break;
          }
          case "unhighlight": {
            var highlights = data.highlights;
            highlights.forEach(element => {
              var verseId = element.verse;
              var h_element = document.querySelectorAll("[data-verse='" + verseId + "']")[0];
              h_element.classList.remove('highlight');
  
            });
  
            break;
          }
        }
      }
      function clickAction(e) {
        var target = e.target;
        
        var div = null;
        if (target.tagName.toLowerCase() == 'div') {
          div = target;
        } else {
          div = target.closest("div");
        }
  
        if (div) {
          // alert(JSON.stringify(div,null,4));
          console.log(div)
          var data = {};
          data.verse = div.dataset.verse;
          data.text = div.outerHTML;
          data.id = data.verse.split('.')[2];
          if (div.classList.contains(underline)) {
            div.classList.remove(underline);
            data.action = "clear";
          } else {
            div.classList.add(underline);
            if (div.classList.contains("highlight")) {
              data.highlighted = true;
            }
            data.action = "underline";
          }
          window.postMessage(JSON.stringify(data));
        }
      }`,
    html:(fontSize,primaryColor)=> `
      <html>
<meta name="viewport" content="initial-scale=1.0, maximum-scale=1.0">
<style>
    .underline {
        text-decoration-line: underline;
        text-decoration-style: solid;
        color: ${primaryColor};
    }

    .highlight {
        color: white;
        background-color: ${primaryColor};
    }

    .underline.highlight {
        background-color: black;
        color: ${primaryColor};
        line-height: ${fontSize}+5px;
    }

    .verse {
        display: inline;
        /*cursor: pointer; */
    }

    .p {
        display: inline;
    }

    .q {
        background-color: inherit;
        display: table;
    }
</style>
<body style="font-size:${fontSize}px;">
      `,
}

export default parts;