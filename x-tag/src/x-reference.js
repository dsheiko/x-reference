 (function( xtag ){
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
        var dialog;
        return {
          /**
           * Render modal elementa into DOM
           */
          open: function() {
            dialog = document.createElement( "x-modal" );
            dialog.innerHTML = "<p>Loading...</p>";
            document.body.appendChild( dialog );
            dialog.setAttribute( "hidden", "hidden" );
            dialog.setAttribute( "overlay", "overlay" );
            dialog.setAttribute( "overlay-tap-hide", "overlay-tap-hide" );
            dialog.setAttribute( "transition", "transition" );
          },
          /**
           * Show up the modal and populate it with given content
           * @param {String} title
           * @param {String} href
           * @param {String} text
           * @returns {undefined}
           */
          populate: function( title, href, text ){
            dialog.innerHTML = "<div class=\"container\"><button class=\"close-btn\">&#10006;</button>" +
              "<div class=\"content\"></div><a target=\"_blank\" class=\"title\"></a></div>";
            dialog.querySelector( ".title" ).href = href;
            dialog.querySelector( ".title" ).innerHTML = title;
            dialog.querySelector( ".content" ).innerHTML = text;
            dialog.show();
            dialog.querySelector( ".close-btn" ).addEventListener("click", this.handleClose.bind( this ), false );
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
            dialog.hide();
            window.setTimeout(function(){
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

    xtag.register('x-reference', {
        extends: "a",
        lifecycle: {
          created: function() {
            this.xtag.xreference = new xReferenceView( this );
          }
        },
        events: {
          'click': function( e ){
            this.xtag.xreference.handleOnClick( e );
          }
        },
        methods: {
          'openModal': function(){
            this.xtag.xreference.openModal();
          }
        }
      });
    }( xtag ));