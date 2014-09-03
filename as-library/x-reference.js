 (function(){
      /** @type {Node} */
  var document = window.document,
      /**
       * Helpers
       * @type {Object}
       */
      utils = {
        /**
         * Request HTTP
         * @param {String} url
         * @param {Function} cb
         */
         get: function( url, cb ) {
          var oReq = new XMLHttpRequest();
          oReq.addEventListener( "load", cb, false );
          oReq.open( "get", url );
          oReq.responseType = "document";
          oReq.send();
        },
        /**
         * Execute provided callback once per node list element
         * @param {NodeList} nodeList
         * @param {Function} cb
         */
        forEachInNodeList: function( nodeList, cb ) {
          Array.prototype.forEach.call( nodeList, cb );
        }
      },
      /**
       * Object representing modal window. It rely on 'dialog' element API where it's available
       */
      ModalView = function(){
            /** @type Node */
        var dialog,
            /** @type Node */
            backdrop,
            /** @type Node */
            title,
             /** @type Node */
            content,
            /** @type Node */
            closeBtn;
        return {
          /**
           * Render modal elementa into DOM
           */
          render: function() {
            backdrop = document.createElement( "div" );
            dialog = document.createElement( "dialog" );
            backdrop.className = "backdrop";
            dialog.innerHTML = "<div class=\"container\"><button class=\"close-btn\">&#10006;</button>" +
              "<div class=\"content\"></div><a target=\"_blank\" class=\"title\"></a></div>";
            document.body.appendChild( backdrop );
            document.body.appendChild( dialog );
            title = dialog.querySelector( ".title" );
            content = dialog.querySelector( ".content" );
            closeBtn = dialog.querySelector( ".close-btn" );
          },
          /**
           * Show up the modal and populate it with given content
           */
          open: function(){
            this.render();
            dialog.querySelector( ".content" ).innerHTML = "Loading...";
            title.classList.add( "is-hidden" );
            closeBtn.classList.add( "is-hidden" );
            window.setTimeout(function(){
              dialog.classList.add( "is-visible" );
              backdrop.classList.add( "is-visible" );
            }, 0 );
          },
          /**
           * Show up the modal and populate it with given content
           * @param {String} titleTxt
           * @param {String} href
           * @param {String} text
           */
          populate: function( titleTxt, href, text ){
            title.href = href;
            title.innerHTML = titleTxt;
            content.innerHTML = text;
            content.classList.add( "is-quoted" );
            title.classList.remove( "is-hidden" );
            closeBtn.classList.remove( "is-hidden" );
            dialog.hasOwnProperty( "show" ) && dialog.show();
            closeBtn.addEventListener("click", this.handleClose.bind( this ), false );
          },
          /**
           * Handle close-btn click
           * @param {Event} e
           */
          handleClose: function( e ) {
            e.preventDefault();
            this.close();
          },
          /**
           * Hide modal
           */
          close: function(){
            dialog.classList.remove( "is-visible" );
            backdrop.classList.remove( "is-visible" );
            dialog.hasOwnProperty( "close" ) && dialog.close();
            window.setTimeout(function(){
              document.body.removeChild( backdrop );
              document.body.removeChild( dialog );
            }, 500 );
          }
        };
      },
      /**
       * Object (constructor) representing x-reference element
       * @param {Node} node
       */
      xReferenceView = function( node ){
        return {
          /**
           * Subscribe click event
           */
          init: function() {
            node.addEventListener( "click", this.handleOnClick.bind( this ), false );
          },
          /**
           * Handle click event
           * @param {Event} e
           */
          handleOnClick: function( e ){
            e.preventDefault();
            this.openModal();
          },
          /**
           * Open modal with extract from external resource
           */
          openModal: function() {
            var that = this,
                modal = new ModalView();
             modal.open();
             utils.get( node.getAttribute( "href" ), function(){
              var title = this.response.head.querySelector( "title" ).textContent || node.getAttribute( "href" ),
                  extract = node.getAttribute( "locator" ) ?
                that.getFragmentByLocator( node.getAttribute( "locator" ), this.response ) :
                that.getFragmentByGrep( node.getAttribute( "grep" ), this.response );

              modal.populate( title, node.getAttribute( "href" ),
                extract || "Nothing found" );
            });
          },
          /**
           * Extract reference target by locator
           * @param {String} sel - selector
           * @param {Node} doc - DOM of the requested document
           * @returns {String}
           */
          getFragmentByLocator: function( sel, doc ){
            var node = doc.querySelector( sel );
            return node ? node.textContent : "";
          },
          /**
           * Extract reference target by grep condition
           * @param {String} grep - regexp
           * @param {Node} doc - DOM of the requested document
           * @returns {String}
           */
          getFragmentByGrep: function( grep, doc ){
            var re = new RegExp( grep, "i" ),
                text = doc.body.textContent;
            return text.match( re )[ 1 ];
          }
        };
      };
      // When DOM is ready render modal assets and init avaiable x-reference nodes
      window.addEventListener( "DOMContentLoaded", function(){
        utils.forEachInNodeList( window.document.body.querySelectorAll( "x-reference" ), function( ref ){
          ( new xReferenceView( ref ) ).init();
        });
      });

    }());