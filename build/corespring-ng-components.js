// Generated by CoffeeScript 1.3.3

/*
----------------------------------------------------------
Corespring Angular components (corespring-ng-components)
@link https://github.com/thesib/corespring-ng-components
----------------------------------------------------------
*/


(function() {



}).call(this);
// Generated by CoffeeScript 1.3.3
(function() {

  angular.module('cs.directives', []);

  angular.module('cs', ['cs.directives']).value('cs.config', {});

}).call(this);
// Generated by CoffeeScript 1.3.3

/*
aceEditor directive usage:
<div ace-editor
 ace-model="myText"
 ace-resize-trigger="some"
 ace-theme="sometheme"
 ace-mode="mode"></div>
dependencies:
ace.js + whatever theme and mode you wish to use
@param ace-model - a ng model that contains the text to display in the editor. When the code is changed in
the editor this model will be updated.
@param ace-resize-events - a comma delimited list of ng events that that should trigger a resize
@param ace-theme - an ace theme - loads them using "ace/theme/" + the them you specify. (you need to include the js for it)
@param ace-mode - an ace mode - as above loads a mode.
*/


(function() {

  angular.module('cs.directives').directive('aceEditor', function($timeout) {
    var definition;
    definition = {
      replace: true,
      template: "<div/>",
      link: function(scope, element, attrs) {
        /*
              Apply a nested value..
        */

        var AceMode, applyValue, attachResizeEvents, initialData, mode, theme;
        applyValue = function(obj, property, value) {
          var nextProp, props;
          if (!(obj != null)) {
            throw "Cannot apply to null object the property:  " + property + " with value: " + value;
          }
          if (property.indexOf(".") === -1) {
            scope.$apply(function() {
              return obj[property] = value;
            });
          } else {
            props = property.split(".");
            nextProp = props.shift();
            applyValue(obj[nextProp], props.join("."), value);
          }
          return null;
        };
        /* 
        # Attach a listener for events that need to trigger a resize of the editor.
        # @param events
        */

        attachResizeEvents = function(events) {
          var event, eventsArray, _i, _len;
          eventsArray = events.split(",");
          for (_i = 0, _len = eventsArray.length; _i < _len; _i++) {
            event = eventsArray[_i];
            scope.$on(event, function() {
              return $timeout(function() {
                scope.editor.resize();
                if (scope.aceModel != null) {
                  return scope.editor.getSession().setValue(scope.$eval(scope.aceModel));
                }
              });
            });
          }
          return null;
        };
        if (attrs["aceResizeEvents"] != null) {
          attachResizeEvents(attrs["aceResizeEvents"]);
        }
        scope.editor = ace.edit(element[0]);
        scope.editor.getSession().setUseWrapMode(true);
        theme = attrs["aceTheme"] || "eclipse";
        scope.editor.setTheme("ace/theme/" + theme);
        mode = attrs["aceMode"] || "xml";
        AceMode = require('ace/mode/' + mode).Mode;
        scope.editor.getSession().setMode(new AceMode());
        scope.aceModel = attrs["aceModel"];
        initialData = scope.$eval(scope.aceModel);
        scope.editor.getSession().setValue(initialData);
        return scope.editor.getSession().on("change", function() {
          var newValue;
          newValue = scope.editor.getSession().getValue();
          return applyValue(scope, scope.aceModel, newValue);
        });
      }
    };
    return definition;
  });

}).call(this);
// Generated by CoffeeScript 1.3.3

/*
file-uploader - a directive for providing a file upload utility.

Usage:
	<a file-uploader fu-url="/file-upload" fu-name="my-file">add file</a>

  @params
    fu-url (string or name of function on scope)
    fu-name (the item name [only relevant for multipart upload])
    fu-mode (raw|multipart [default: multipart]) 
      raw places the data directly into the content body
      multipart create the 'content flags' eg:  'content-disposition', 'boundary'
    fu-max-size the max size in kB that a user can upload (default: 200)

Events:
  "uploadStarted"  (event) ->  : fired when uploading has started
  "uploadCompleted" (event, serverResponse)-> : fired when uploading is completed

Dependencies: JQuery

TODO: Support file drag and drop
*/


(function() {

  angular.module('cs.directives').directive('fileUploader', function($rootScope) {
    var definition;
    definition = {
      replace: false,
      link: function(scope, element, attrs) {
        var $fuHiddenInput, createFileInput, fuUid, handleFileSelect, maxSize, maxSizeKb, mode, onLocalFileLoadEnd, uploadClick;
        mode = "multipart";
        if (attrs.fuMode === "raw") {
          mode = "raw";
        }
        maxSizeKb = parseInt(attrs.fuMaxSize) || 200;
        maxSize = maxSizeKb * 1024;
        fuUid = "file_upload_input_" + (Math.round(Math.random() * 10000));
        $fuHiddenInput = null;
        uploadClick = function() {
          return $fuHiddenInput.trigger('click');
        };
        createFileInput = function() {
          var styleDef,
            _this = this;
          styleDef = "position: absolute; left: 0px; top: 0px; width: 0px; height: 0px; visibility: hidden; padding: 0px; margin: 0px; line-height: 0px;";
          scope.fileInput = "<input \n       type=\"file\" \n       id=\"" + fuUid + "\"\n       style=\"" + styleDef + "\" \n       name=\"" + attrs.fuName + "\">\n</input>";
          $(element).parent().append(scope.fileInput);
          $fuHiddenInput = $(element).parent().find("#" + fuUid);
          $fuHiddenInput.change(function(event) {
            return handleFileSelect(event);
          });
          return null;
        };
        handleFileSelect = function(event) {
          var file, files, reader,
            _this = this;
          files = event.target.files;
          file = event.target.files[0];
          reader = new FileReader();
          reader.onloadend = function(event) {
            return onLocalFileLoadEnd(file, event);
          };
          reader.readAsBinaryString(file);
          return null;
        };
        /*
              Once the file has been read locally - invoke the Multipart File upload.
        */

        onLocalFileLoadEnd = function(file, event) {
          var callback, name, options, uploader, url,
            _this = this;
          if (file.size > maxSize) {
            $rootScope.$broadcast("fileSizeGreaterThanMax", file, maxSizeKb);
            return;
          }
          url = attrs.fuUrl;
          if (attrs.fuUrl.indexOf("()") !== -1) {
            callback = attrs.fuUrl.replace("(", "").replace(")", "");
            if (typeof scope[callback] === "function") {
              url = scope[callback](file);
            }
          }
          name = attrs.fuName;
          options = {
            onLoadStart: function() {
              return $rootScope.$broadcast("uploadStarted");
            },
            onUploadComplete: function(responseText) {
              return $rootScope.$broadcast("uploadCompleted", responseText);
            }
          };
          if (mode === "raw") {
            uploader = new com.ee.RawFileUploader(file, event.target.result, url, name, options);
          } else {
            uploader = new com.ee.MultipartFileUploader(file, event.target.result, url, name, options);
          }
          uploader.beginUpload();
          return null;
        };
        createFileInput();
        element.bind('click', uploadClick);
        return null;
      }
    };
    return definition;
  });

}).call(this);
// Generated by CoffeeScript 1.3.3

/*
Taken from: 
https://github.com/edeustace/inplace-image-changer
*/


(function() {

  if (!XMLHttpRequest.prototype.sendAsBinary) {
    XMLHttpRequest.prototype.sendAsBinary = function(dataStr) {
      var byteValue, ords, ui8a;
      byteValue = function(x) {
        return x.charCodeAt(0) & 0xff;
      };
      ords = Array.prototype.map.call(dataStr, byteValue);
      ui8a = new Uint8Array(ords);
      this.send(ui8a.buffer);
      return null;
    };
  }

  window.com || (window.com = {});

  com.ee || (com.ee = {});

  /*
  Simplifies the xhr upload api
  */


  this.com.ee.XHRWrapper = (function() {

    function XHRWrapper(file, formBody, url, name, options) {
      var now,
        _this = this;
      this.file = file;
      this.formBody = formBody;
      this.url = url;
      this.name = name;
      this.options = options;
      formBody = this.binaryData;
      now = new Date().getTime();
      this.request = new XMLHttpRequest();
      this.request.upload.index = 0;
      this.request.upload.file = this.file;
      this.request.upload.downloadStartTime = now;
      this.request.upload.currentStart = now;
      this.request.upload.currentProgress = 0;
      this.request.upload.startData = 0;
      this.request.open("POST", this.url, true);
      this.request.setRequestHeader("Accept", "application/json");
      if (this.options.onLoadStart != null) {
        this.options.onLoadStart();
      }
      this.request.onload = function() {
        if (_this.options.onUploadComplete != null) {
          return _this.options.onUploadComplete(_this.request.responseText);
        }
      };
    }

    XHRWrapper.prototype.setRequestHeader = function(name, value) {
      this.request.setRequestHeader(name, value);
      return null;
    };

    XHRWrapper.prototype.beginUpload = function() {
      this.request.sendAsBinary(this.formBody);
      return null;
    };

    return XHRWrapper;

  })();

  /*
  Place the binary data directly into the request body.
  */


  this.com.ee.RawFileUploader = (function() {

    function RawFileUploader(file, binaryData, url, name, options) {
      this.file = file;
      this.binaryData = binaryData;
      this.url = url;
      this.name = name;
      this.options = options;
      this.xhr = new com.ee.XHRWrapper(this.file, this.binaryData, this.url, this.name, this.options);
      this.xhr.setRequestHeader("Accept", "application/json");
    }

    RawFileUploader.prototype.beginUpload = function() {
      return this.xhr.beginUpload();
    };

    return RawFileUploader;

  })();

  /*
  Build up a multipart form data request body
  */


  this.com.ee.MultipartFileUploader = (function() {

    function MultipartFileUploader(file, binaryData, url, name, options) {
      var boundary, formBody, uid;
      this.file = file;
      this.binaryData = binaryData;
      this.url = url;
      this.name = name;
      this.options = options;
      uid = Math.floor(Math.random() * 100000);
      boundary = "------multipartformboundary" + uid;
      formBody = this._buildMultipartFormBody(this.file, this.binaryData, boundary);
      this.xhr = new com.ee.XHRWrapper(this.file, formBody, this.url, this.name, this.options);
      this.xhr.setRequestHeader('content-type', "multipart/form-data; boundary=" + boundary);
      this.xhr.setRequestHeader("Accept", "application/json");
    }

    MultipartFileUploader.prototype.beginUpload = function() {
      return this.xhr.beginUpload();
    };

    MultipartFileUploader.prototype._buildMultipartFormBody = function(file, fileBinaryData, boundary) {
      var fileParams, formBuilder, params;
      formBuilder = new com.ee.MultipartFormBuilder(boundary);
      params = this.options.additionalData;
      fileParams = [
        {
          file: file,
          data: fileBinaryData,
          paramName: this.name
        }
      ];
      return formBuilder.buildMultipartFormBody(params, fileParams, boundary);
    };

    return MultipartFileUploader;

  })();

}).call(this);
// Generated by CoffeeScript 1.3.3

/*
Taken from: 
https://github.com/edeustace/inplace-image-changer
*/


(function() {

  window.com || (window.com = {});

  com.ee || (com.ee = {});

  this.com.ee.MultipartFormBuilder = (function() {

    function MultipartFormBuilder(boundary) {
      this.boundary = boundary;
      this.dashdash = "--";
      this.crlf = "\r\n";
    }

    /*
        fileParams = [
           
            {file : file (File)
            data : fileBinaryData
            paramName : name of request parameter}
          
            ...
            ]
    */


    MultipartFormBuilder.prototype.buildMultipartFormBody = function(params, fileParams) {
      var output,
        _this = this;
      output = "";
      if (params != null) {
        $.each(params, function(i, val) {
          if ((typeof val) === 'function') {
            val = val();
          }
          return output += _this.buildFormSegment(i, val);
        });
      }
      if (fileParams != null) {
        $.each(fileParams, function(i, val) {
          output += _this.buildFileFormSegment(val.paramName, val.file, val.data);
          return null;
        });
      }
      output += this.dashdash;
      output += this.boundary;
      output += this.dashdash;
      output += this.crlf;
      return output;
    };

    MultipartFormBuilder.prototype.buildFormSegment = function(key, value) {
      var contentDisposition;
      contentDisposition = this._buildContentDisposition(key);
      return this._buildFormSegment(contentDisposition, value);
    };

    MultipartFormBuilder.prototype._buildContentDisposition = function(name) {
      var template;
      template = "Content-Disposition: form-data; name=\"${name}\" ";
      return template.replace("${name}", name);
    };

    MultipartFormBuilder.prototype._buildFileContentDisposition = function(formName, fileName) {
      var out;
      this.template = "Content-Disposition: form-data; name=\"${formName}\"; filename=\"${fileName}\" ";
      out = this.template.replace("${formName}", formName);
      out = out.replace("${fileName}", fileName);
      return out;
    };

    MultipartFormBuilder.prototype.buildFileFormSegment = function(formName, file, binaryData) {
      var contentDisposition;
      contentDisposition = this._buildFileContentDisposition(formName, file.name);
      contentDisposition += this.crlf;
      contentDisposition += "Content-Type: " + file.type;
      return this._buildFormSegment(contentDisposition, binaryData);
    };

    MultipartFormBuilder.prototype._buildFormSegment = function(contentDisposition, value) {
      var output;
      output = '';
      output += this.dashdash;
      output += this.boundary;
      output += this.crlf;
      output += contentDisposition;
      output += this.crlf;
      output += this.crlf;
      output += value;
      output += this.crlf;
      return output;
    };

    return MultipartFormBuilder;

  })();

}).call(this);
// Generated by CoffeeScript 1.3.3

/*
infinite scrolling module
Triggers a callback to the scope.
Usage: 
<div when-scrolled="doSomething()"/>
*/


(function() {

  angular.module('cs.directives').directive('whenScrolled', function() {
    var fn;
    fn = function(scope, elm, attr) {
      var funCheckBounds, raw;
      raw = elm[0];
      funCheckBounds = function() {
        var rectObject;
        rectObject = raw.getBoundingClientRect();
        if (rectObject.height === 0) {
          return;
        }
        if (rectObject.bottom <= window.innerHeight) {
          scope.$apply(attr.whenScrolled);
        }
        return null;
      };
      return angular.element(window).bind('scroll', funCheckBounds);
    };
    return fn;
  });

}).call(this);
