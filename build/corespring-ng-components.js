(function() {
  var version;

  version = '0.0.20';

  angular.module('cs.services', []);

  angular.module('cs.directives', ['cs.services']);

  angular.module('cs', ['cs.directives']).value('cs.config', {});

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


  angular.module('cs.directives').directive('aceEditor', [
    '$timeout', 'Utils', function($timeout, Utils) {
      var definition;
      definition = {
        replace: true,
        template: "<div/>",
        link: function(scope, element, attrs) {
          var applyValue, attachResizeEvents, initialData, onExceptionsChanged, theme;
          applyValue = Utils.applyValue;
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
          onExceptionsChanged = function(newValue, oldValue) {
            var exception, _i, _j, _len, _len1;
            if (oldValue != null) {
              for (_i = 0, _len = oldValue.length; _i < _len; _i++) {
                exception = oldValue[_i];
                scope.editor.renderer.removeGutterDecoration(exception.lineNumber - 1, "ace_failed");
              }
            }
            if (newValue != null) {
              for (_j = 0, _len1 = newValue.length; _j < _len1; _j++) {
                exception = newValue[_j];
                scope.editor.renderer.addGutterDecoration(exception.lineNumber - 1, "ace_failed");
              }
            }
            return null;
          };
          if (attrs["aceResizeEvents"] != null) {
            attachResizeEvents(attrs["aceResizeEvents"]);
          }
          if (attrs["aceExceptions"] != null) {
            scope.$watch(attrs["aceExceptions"], onExceptionsChanged);
          }
          scope.editor = ace.edit(element[0]);
          scope.editor.getSession().setUseWrapMode(true);
          theme = attrs["aceTheme"] || "eclipse";
          scope.editor.setTheme("ace/theme/" + theme);
          scope.$watch(attrs["aceMode"], function(newValue, oldValue) {
            var AceMode, factoryPath, modeFactory;
            if (newValue == null) {
              return;
            }
            if (scope.editor == null) {
              return;
            }
            if (newValue === "js") {
              newValue = "javascript";
            }
            factoryPath = "ace/mode/" + newValue;
            modeFactory = require(factoryPath);
            if (modeFactory == null) {
              return;
            }
            AceMode = modeFactory.Mode;
            scope.editor.getSession().setMode(new AceMode());
            return null;
          });
          scope.aceModel = attrs["aceModel"];
          scope.$watch(scope.aceModel, function(newValue, oldValue) {
            if (scope.changeFromEditor) {
              return;
            }
            $timeout(function() {
              scope.suppressChange = true;
              scope.editor.getSession().setValue(newValue);
              scope.suppressChange = false;
              return null;
            });
            return null;
          });
          initialData = scope.$eval(scope.aceModel);
          scope.editor.getSession().setValue(initialData);
          return scope.editor.getSession().on("change", function() {
            var newValue;
            if (scope.suppressChange) {
              return;
            }
            scope.changeFromEditor = true;
            newValue = scope.editor.getSession().getValue();
            applyValue(scope, scope.aceModel, newValue);
            scope.changeFromEditor = false;
            return null;
          });
        }
      };
      return definition;
    }
  ]);

  angular.module('cs.directives').directive('buttonBar', [
    '$log', function($log) {
      var link, out;
      link = function($scope, $element, $attr) {
        $scope.selected = function(b) {
          var dataValue;
          dataValue = $scope.getValue(b);
          return $scope.ngModel && $scope.ngModel.indexOf(dataValue) !== -1;
        };
        $scope.toggle = function(b) {
          var dataValue, index;
          $scope.ngModel = $scope.ngModel || [];
          dataValue = $scope.getValue(b);
          index = $scope.ngModel.indexOf(dataValue);
          if (index === -1) {
            return $scope.ngModel.push(dataValue);
          } else {
            return $scope.ngModel.splice(index, 1);
          }
        };
        return $scope.getValue = function(b) {
          if ($scope.key != null) {
            return b[$scope.key];
          } else {
            return b;
          }
        };
      };
      out = {
        restrict: 'E',
        link: link,
        replace: true,
        scope: {
          buttonProvider: '=',
          ngModel: '=',
          key: '@'
        },
        template: "<div class=\"btn-group btn-group-justified\">\n  <div class=\"btn-group\"\n      ng-repeat=\"b in buttonProvider\" \n      >\n    <button \n      type=\"button\" \n      ng-click=\"toggle(b)\"\n      onmouseout=\"this.blur()\"\n      ng-class=\"{ active: selected(b)}\"\n      class=\"btn btn-default\">{{getValue(b)}}</button>\n    </div>\n</div>"
      };
      return out;
    }
  ]);

  /*
    Confirm popup. depends on angular-ui + bootstrap
  
    Usage: 
      <div confirm-popup ng-model="selected"
        confirmed="onConfirmed" cancelled="onCancelled">
      <h2>remove?</h2>
      <p>Are you sure?</p>
      <button id="confirm">Yes</button>
      <button id="cancel">No</button>
    </div>
  */


  angular.module('cs.directives').directive('confirmPopup', [
    '$timeout', 'Utils', function($timeout, Utils) {
      var definition, link;
      link = function(scope, elm, attrs, model) {
        elm.addClass('modal hide');
        elm.find("#confirm").click(function() {
          elm.modal('hide');
          if (scope[attrs.confirmed] != null) {
            scope[attrs.confirmed]();
          }
          return null;
        });
        elm.find("#cancel").click(function() {
          scope.$apply(function() {
            Utils.applyValue(scope, attrs.ngModel, scope.stashedValue);
            return null;
          });
          scope.stashedValue = null;
          elm.modal('hide');
          if (scope[attrs.cancelled] != null) {
            scope[attrs.cancelled]();
          }
          return null;
        });
        scope.$watch(attrs.ngModel, function(newValue, oldValue) {
          if (oldValue === true && newValue === false) {
            scope.stashedValue = oldValue;
            elm.modal({
              show: true
            });
          }
          if ((newValue == null) && (oldValue != null)) {
            scope.stashedValue = oldValue;
            return elm.modal({
              show: true
            });
          }
        });
        elm.on('shown', function() {
          return elm.find("[autofocus]").focus();
        });
        return null;
      };
      definition = {
        require: 'ngModel',
        link: link
      };
      return definition;
    }
  ]);

  angular.module('cs.directives').directive('contentEditable', function() {
    var ENTER_KEY, TAB_KEY, definition;
    ENTER_KEY = 13;
    TAB_KEY = 9;
    definition = {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        ngModel: '=',
        contentId: '@',
        eventType: '@',
        removeFocusAfterEdit: '@',
        validateChange: '&'
      },
      link: function($scope, $element, $attrs) {
        var allowUpdate, eventType, processChange, removeFocusAfterEdit;
        console.log("removeFocusAfterEdit: " + $scope.removeFocusAfterEdit);
        $element.attr('contenteditable', '');
        $scope.$watch('ngModel', function(newValue) {
          $element.html($scope.ngModel);
          return null;
        });
        $scope.onValidationResult = function(success) {
          if (success) {
            $scope.ngModel = $element.html();
          }
          return null;
        };
        processChange = function(text) {
          if ($scope.validateChange && $attrs.validateChange) {
            return $scope.validateChange({
              text: text,
              id: $scope.contentId,
              callback: $scope.onValidationResult
            });
          } else {
            return $scope.onValidationResult(true);
          }
        };
        allowUpdate = function(key) {
          if ($scope.eventType === "ALL") {
            return true;
          } else if ($scope.eventType === "TAB" && key === TAB_KEY) {
            return true;
          } else if (key === ENTER_KEY) {
            return true;
          }
        };
        removeFocusAfterEdit = function() {
          return $scope.removeFocusAfterEdit !== "false";
        };
        eventType = $scope.eventType === "ALL" ? "keyup" : "keydown";
        $element.bind(eventType, function(event) {
          var change;
          if (allowUpdate(event.which)) {
            console.log("update allowed....");
            change = $element.html();
            processChange(change);
            if (removeFocusAfterEdit()) {
              $element.blur();
            }
          }
          return null;
        });
        return $element.bind('blur', function() {
          $element.html($scope.ngModel);
          return null;
        });
      }
    };
    return definition;
  });

  angular.module('cs.directives').directive('fileDrop', function($rootScope) {
    var definition;
    definition = {
      link: function($scope, $element, $attrs) {
        var acceptedFileTypes, acceptedType, addListener, callback, dragFn, dragLeave, dragOver, drop, dropBody, dropbox, getClassNames, originalClasses;
        getClassNames = function(e) {
          return e.attr('class').split(/\s+/);
        };
        callback = $scope[$attrs['onFileDropped']];
        originalClasses = getClassNames($element);
        acceptedFileTypes = $attrs['fileTypes'].split(",");
        dropbox = $element[0];
        acceptedType = function(file) {
          var t, _i, _len;
          for (_i = 0, _len = acceptedFileTypes.length; _i < _len; _i++) {
            t = acceptedFileTypes[_i];
            if (file.type.indexOf(t) !== -1) {
              return true;
            }
          }
          return false;
        };
        dragFn = function(className, fn) {
          return function(evt) {
            console.log("drag enter leave");
            $element.attr('class', originalClasses.join(" "));
            if (className != null) {
              $element.addClass(className);
            }
            evt.stopPropagation();
            evt.preventDefault();
            if (fn != null) {
              fn(evt);
            }
            return null;
          };
        };
        dragLeave = dragFn();
        dragOver = dragFn("over");
        dropBody = function(evt) {
          var files;
          console.log('drop evt:', JSON.parse(JSON.stringify(evt.dataTransfer)));
          files = evt.dataTransfer.files;
          if (files.length === 1 && acceptedType(files[0])) {
            console.log(files);
            if (callback != null) {
              callback(files[0]);
            }
          }
          return null;
        };
        drop = dragFn("", dropBody);
        addListener = function(target, msg, fn, weak) {
          if (target['addEventListener']) {
            target.addEventListener(msg, fn, weak);
          } else if (target['attachEvent']) {
            target.attachEvent(msg, fn, weak);
          }
          return null;
        };
        addListener(dropbox, "dragleave", dragLeave, false);
        addListener(dropbox, "dragover", dragOver, false);
        return addListener(dropbox, "drop", drop, false);
      }
    };
    return definition;
  });

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
    "uploadCompleted" (event, serverResponse, serverStatus)-> : fired when uploading is completed
  
  Dependencies: JQuery
  
  TODO: Support file drag and drop
  */


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
            if (scope[attrs["fuFileSizeGreaterThanMax"]] != null) {
              scope[attrs["fuFileSizeGreaterThanMax"]](file, maxSizeKb);
            }
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
            onUploadComplete: function(responseText, status) {
              var fnExpr;
              fnExpr = attrs["fuUploadCompleted"];
              if (fnExpr) {
                if (fnExpr.indexOf('(') >= 0) {
                  scope.$eval(fnExpr);
                } else if (scope[fnExpr] != null) {
                  scope[fnExpr](responseText, status);
                }
              }
              return $rootScope.$broadcast("uploadCompleted", responseText, status);
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

  /*
  Taken from: 
  https://github.com/edeustace/inplace-image-changer
  */


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

  com.ee.v2 || (com.ee.v2 = {});

  /* 
      Prevents a RangeError from occuring for large images.
      see:  http://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
  */


  com.ee.v2.binaryArrayToString = function(buffer) {
    var CHUNK_SIZE, arr, index, length, result, slice;
    arr = new Uint8Array(buffer);
    CHUNK_SIZE = 0x8000;
    index = 0;
    length = arr.length;
    result = '';
    slice = null;
    while (index < length) {
      slice = arr.subarray(index, Math.min(index + CHUNK_SIZE, length));
      result += String.fromCharCode.apply(null, slice);
      index += CHUNK_SIZE;
    }
    return result;
  };

  /*
  Simplifies the xhr upload api
  */


  com.ee.XHRWrapper = (function() {
    function XHRWrapper(file, formBody, url, name, options) {
      var now, withCredentials,
        _this = this;
      this.file = file;
      this.formBody = formBody;
      this.url = url;
      this.name = name;
      this.options = options;
      this.options = this.options || {};
      now = new Date().getTime();
      this.request = new XMLHttpRequest();
      this.request.upload.index = 0;
      withCredentials = this.options.withCredentials != null ? this.options.withCredentials : true;
      this.request.withCredentials = withCredentials;
      this.request.upload.file = this.file;
      this.request.upload.downloadStartTime = now;
      this.request.upload.currentStart = now;
      this.request.upload.currentProgress = 0;
      this.request.upload.startData = 0;
      if (this.options.onUploadProgress != null) {
        this.request.upload.addEventListener("progress", this.options.onUploadProgress, false);
      }
      if (this.options.onUploadFailed != null) {
        this.request.upload.addEventListener("error", this.options.onUploadFailed, false);
      }
      if (this.options.onUploadCanceled != null) {
        this.request.upload.addEventListener("abort", this.options.onUploadCanceled, false);
      }
      this.request.open("POST", this.url, true);
      this.request.setRequestHeader("Accept", "application/json");
      this.request.onload = function() {
        if ([200, 201, 202, 203, 204].indexOf(_this.request.status) === -1) {
          if (_this.options.onUploadFailed != null) {
            return _this.options.onUploadFailed(_this.request);
          }
        } else {
          if (_this.options.onUploadComplete != null) {
            return _this.options.onUploadComplete(_this.request.responseText, _this.request.status);
          }
        }
      };
    }

    XHRWrapper.prototype.setRequestHeader = function(name, value) {
      this.request.setRequestHeader(name, value);
      return null;
    };

    XHRWrapper.prototype.beginUpload = function() {
      if (this.options.onLoadStart != null) {
        this.options.onLoadStart();
      }
      if (typeof this.formBody === 'string') {
        this.request.sendAsBinary(this.formBody);
      } else {
        this.request.send(this.formBody);
      }
      return null;
    };

    return XHRWrapper;

  })();

  com.ee.v2.RawFileUploader = (function() {
    function RawFileUploader(file, url, name, options) {
      var reader,
        _this = this;
      this.file = file;
      this.url = url;
      this.name = name;
      this.options = options;
      reader = new FileReader();
      reader.onload = function(e) {
        _this.binaryData = e.target.result;
        _this.xhr = new com.ee.XHRWrapper(_this.file, _this.binaryData, _this.url, _this.name, _this.options);
        _this.xhr.setRequestHeader("Accept", "application/json");
        _this.xhr.setRequestHeader("Content-Type", "application/octet-stream");
        return _this.xhr.beginUpload();
      };
      reader.readAsArrayBuffer(this.file);
    }

    return RawFileUploader;

  })();

  /*
  Build up a multipart form data request body
  */


  com.ee.v2.MultipartFileUploader = (function() {
    function MultipartFileUploader(file, url, name, options) {
      var reader,
        _this = this;
      this.file = file;
      this.url = url;
      this.name = name;
      this.options = options;
      reader = new FileReader();
      reader.onload = function(e) {
        var boundary, formBody;
        _this.binaryData = e.target.result;
        boundary = "------multipartformboundary-com-ee-mpfu";
        _this.rawData = _this.mkBinaryString(_this.binaryData);
        formBody = _this._buildMultipartFormBody(_this.file, _this.rawData, boundary);
        _this.xhr = new com.ee.XHRWrapper(_this.file, formBody, _this.url, _this.name, _this.options);
        _this.xhr.setRequestHeader('content-type', "multipart/form-data; boundary=" + boundary);
        _this.xhr.setRequestHeader("Accept", "application/json");
        return _this.xhr.beginUpload();
      };
      reader.readAsArrayBuffer(this.file);
    }

    MultipartFileUploader.prototype.mkBinaryString = function(buffer) {
      return com.ee.v2.binaryArrayToString(buffer);
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

  /*
  Place the binary data directly into the request body.
  */


  com.ee.RawFileUploader = (function() {
    function RawFileUploader(file, binaryData, url, name, options) {
      this.file = file;
      this.binaryData = binaryData;
      this.url = url;
      this.name = name;
      this.options = options;
      this.xhr = new com.ee.XHRWrapper(this.file, this.binaryData, this.url, this.name, this.options);
      this.xhr.setRequestHeader("Accept", "application/json");
      this.xhr.setRequestHeader("Content-Type", "application/octet-stream");
    }

    RawFileUploader.prototype.beginUpload = function() {
      return this.xhr.beginUpload();
    };

    return RawFileUploader;

  })();

  /*
  Build up a multipart form data request body
  */


  com.ee.MultipartFileUploader = (function() {
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

  /*
  Taken from: 
  https://github.com/edeustace/inplace-image-changer
  */


  window.com || (window.com = {});

  com.ee || (com.ee = {});

  com.ee.MultipartFormBuilder = (function() {
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

  /*
   * loading-button
   * Simple hookup to twitter button js. 
   * <btn loading-button ngModel="isLoading" data-loading-text="loading..."></btn>
   * dependencies: jQuery and bootstrap.button js
  */


  angular.module('cs.directives').directive('loadingButton', [
    function() {
      var definition;
      definition = {
        require: 'ngModel',
        link: function(scope, element, attrs) {
          return scope.$watch(attrs["ngModel"], function(newValue) {
            var command;
            command = newValue ? "loading" : "reset";
            return $(element).button(command);
          });
        }
      };
      return definition;
    }
  ]);

  /*
  Creates a dropdown with checkboxes so you can select multiple items.
  params:
    @multi-get-title - the function for rendering a title for an individual item
    @multi-get-selected-title - a function that returns the html for the selection,
      function( items -the selected items){ return -a html string }
    @multi-get-options - the data provider for the possible options
    @multi-change - a callback when anything changes
    @multi-uid - a property that uniquely indentifies the object within the array of options
    @multi-model - the model to update with the selection
  usage:
    <span multi-select
                multi-get-selected-title="getCollectionSelectedTitle"
                multi-options="collections"
                multi-change="search"
                multi-uid="name"
                multi-model="searchParams.collection">
              </span>
  
  # BETA:::
  Providing your own repeater.
  
  A new option has been provided - the ability to add your own repeater.
  This allows you to format the options any way you want.
  
  To do this you need to add a node that has the class name "repeater".
  
    Within this you'll be provided an 'options' variable which is the data provider you passed in.
    The next thing you'll need to do is to specify a checkbox that has the following format:
    <input type="checkbox" ng-model="selectedArr[c.${uidKey}]" ng-click="toggleItem(c)"></input>
            {{c.name}}</div>
  
            'selectedArr' - this is an internal array that keeps track of selections
            'uidKey' - this is an internal variable of multi select - during compile phase it gets replaced
            by whatever was passed in as 'multi-uid'. eg: c.${uidKey} -> c.id
            'toggleItem' - an internal function that toggles the selection based on the uid. This will callback to your callback handler.
  */


  angular.module('cs.directives').directive('multiSelect', [
    '$timeout', 'Utils', function($timeout, Utils) {
      var compile, defaultRepeater, definition, link, template;
      defaultRepeater = "<ul>\n  <li ng-repeat=\"o in options\">\n    <label>\n      <input type=\"checkbox\" ng-model=\"selectedArr[o.${uidKey}]\" ng-click=\"toggleItem(o)\">\n      {{multiGetTitle(o)}}\n    </label>\n  </li>\n</ul>";
      template = "<span class=\"multi-select\">\n ${summaryHtml}\n  <div class=\"chooser\" ng-show=\"showChooser\">\n   ${repeater}\n  </div>\n</span>";
      /*
      Linking function
      */

      link = function(scope, element, attrs) {
        var changeCallback, getTitleProp, modelProp, optionsProp, uidKey, updateSelection;
        optionsProp = attrs['multiOptions'];
        uidKey = attrs['multiUid'] || "key";
        modelProp = attrs['multiModel'];
        getTitleProp = attrs['multiGetTitle'];
        changeCallback = attrs['multiChange'];
        scope.noneSelected = "None selected";
        scope.showChooser = false;
        scope.$watch(optionsProp, function(newValue) {
          scope.options = newValue;
          updateSelection();
          return null;
        });
        scope.$watch(modelProp, function(newValue) {
          if (newValue != null) {
            scope.selected = newValue;
          } else {
            scope.selected = [];
          }
          updateSelection();
          return null;
        });
        updateSelection = function() {
          var x, _i, _len, _ref;
          if (scope.selected == null) {
            return null;
          }
          scope.selectedArr = {};
          _ref = scope.selected;
          for (_i = 0, _len = _ref.length; _i < _len; _i++) {
            x = _ref[_i];
            if (x[uidKey]) {
              scope.selectedArr[x[uidKey]] = true;
            }
          }
          return null;
        };
        scope.clearItems = function() {
          Utils.applyValue(scope, modelProp, []);
          updateSelection();
          if (changeCallback != null) {
            return scope[changeCallback]();
          }
        };
        /*
        Need to use $eval to support nested values
        */

        scope.toggleItem = function(i) {
          var arr, getIndexById, index, optionIndex, sortFn;
          getIndexById = function(arr, item) {
            var arrItem, index, _i, _len;
            for (index = _i = 0, _len = arr.length; _i < _len; index = ++_i) {
              arrItem = arr[index];
              if (arrItem[uidKey] && arrItem[uidKey] === item[uidKey]) {
                return index;
              }
            }
            return -1;
          };
          if (scope.$eval(modelProp) == null) {
            Utils.applyValue(scope, modelProp, []);
          }
          arr = scope.$eval(modelProp);
          index = getIndexById(arr, i);
          optionIndex = scope.$eval(optionsProp).indexOf(i);
          if (index === -1) {
            arr.push(i);
          } else {
            arr.splice(index, 1);
          }
          sortFn = function(a, b) {
            var aIndex, bIndex;
            aIndex = scope.$eval(optionsProp).indexOf(a);
            bIndex = scope.$eval(optionsProp).indexOf(b);
            return aIndex - bIndex;
          };
          Utils.applyValue(scope, modelProp, arr.sort(sortFn));
          if (changeCallback != null) {
            scope[changeCallback]();
          }
          return null;
        };
        scope.multiGetTitle = function(t) {
          return scope[getTitleProp](t);
        };
        return null;
      };
      /*
      Fix up the template to use the uid key for the ng-model.
      */

      compile = function(element, attrs, transclude) {
        var outer, prepped, repeater, summaryHtml, uidKey;
        uidKey = attrs['multiUid'] || "key";
        outer = null;
        element.find(".summary").each(function() {
          return outer = $(this).clone().wrap('<p>').parent().html();
        });
        summaryHtml = outer;
        repeater = null;
        element.find(".repeater").each(function() {
          return repeater = $(this).clone().wrap('<p>').parent().html();
        });
        if (repeater == null) {
          repeater = defaultRepeater;
        }
        if (summaryHtml == null) {
          throw "You need to add a summary node to the multi-select: eg: <div id='summary'>...</div>";
        }
        summaryHtml = summaryHtml.replace(/(<.*?)(>)/, "$1 ng-click='showChooser=!showChooser' $2");
        prepped = template.replace("${repeater}", repeater).replace(/\$\{uidKey\}/g, uidKey).replace("${summaryHtml}", summaryHtml);
        element.html(prepped);
        return link;
      };
      definition = {
        restrict: 'A',
        compile: compile,
        scope: 'isolate'
      };
      return definition;
    }
  ]);

  if (!jQuery.expr[':'].matches_ci) {
    jQuery.expr[':'].matches_ci = function(a, i, m) {
      return jQuery(a).text().toUpperCase() === m[3].toUpperCase();
    };
  }

  angular.module('cs.directives').directive('tagList', function($timeout) {
    var definition;
    definition = {
      replace: false,
      template: "<span/>",
      link: function(scope, element, attrs) {
        var applySelectedTags, availableTags, buildTagList, linkClass, onTagClick, selectedTags;
        selectedTags = null;
        availableTags = null;
        linkClass = attrs.tagListLinkClass || "tag-list-link";
        buildTagList = function() {
          var $link, x, _i, _len,
            _this = this;
          $(element).html("<span></span>");
          for (_i = 0, _len = availableTags.length; _i < _len; _i++) {
            x = availableTags[_i];
            $link = $("<a class='" + linkClass + "' href='javascript:void(0)'>" + x + "</a>");
            $(element).append($link);
            $link.click(function(event) {
              return onTagClick(event);
            });
          }
          return null;
        };
        applySelectedTags = function() {
          var $link, selectedTag, _i, _len;
          $(element).find("." + linkClass).removeClass('selected');
          for (_i = 0, _len = selectedTags.length; _i < _len; _i++) {
            selectedTag = selectedTags[_i];
            $link = $(element).find("a:matches_ci('" + selectedTag + "')");
            $link.addClass("selected");
          }
          return null;
        };
        onTagClick = function(event) {
          var isCurrentlySelected, tagName;
          tagName = $(event.target).text();
          isCurrentlySelected = $(event.target).hasClass("selected");
          scope.$apply(function() {
            var index, scopeTagArray;
            scopeTagArray = scope.$eval(attrs.selectedTags);
            if (isCurrentlySelected) {
              index = scopeTagArray.indexOf(tagName);
              return scopeTagArray.splice(index, 1);
            } else {
              if (scopeTagArray.indexOf(tagName) === -1) {
                return scopeTagArray.push(tagName);
              }
            }
          });
          applySelectedTags();
          return null;
        };
        scope.$watch(attrs.selectedTags, function(newValue) {
          selectedTags = newValue;
          if ((availableTags != null) && (selectedTags != null)) {
            applySelectedTags();
          }
          return null;
        });
        scope.$watch(attrs.tags, function(newValue) {
          availableTags = newValue;
          if (availableTags != null) {
            buildTagList();
          }
          if (selectedTags != null) {
            applySelectedTags();
          }
          return null;
        });
        return null;
      }
    };
    return definition;
  });

  /*
  infinite scrolling module
  Triggers a callback to the scope.
  Usage: 
  <div when-scrolled="doSomething()"/>
  */


  /*
  infinite scrolling module
  Triggers a callback to the $scope.
  Usage: 
  <div when-scrolled="doSomething()" scrolled-mode="div|window(default)"/>
  */


  angular.module('cs.directives').directive('whenScrolled', function() {
    var linkFn;
    linkFn = function($scope, $elm, $attrs) {
      var mode, onDivScroll, onWindowScroll, raw;
      raw = $elm[0];
      onDivScroll = function() {
        var rectObject, scrollTop, scrolledTotal;
        rectObject = raw.getBoundingClientRect();
        if (rectObject.height === 0) {
          return;
        }
        scrollTop = $elm.scrollTop();
        scrolledTotal = $elm.scrollTop() + $elm.innerHeight();
        if (scrolledTotal >= raw.scrollHeight) {
          $scope.$apply($attrs.whenScrolled);
        }
        return null;
      };
      onWindowScroll = function() {
        var rectObject;
        rectObject = raw.getBoundingClientRect();
        if (rectObject.height === 0) {
          return;
        }
        if (rectObject.bottom <= window.innerHeight) {
          $scope.$apply($attrs.whenScrolled);
        }
        return null;
      };
      mode = $attrs['scrolledMode'] || 'window';
      if (mode === "window") {
        angular.element(window).bind('scroll', onWindowScroll);
      } else {
        $elm.bind('scroll', onDivScroll);
      }
      return null;
    };
    return linkFn;
  });

  angular.module('cs.services').factory('Utils', function() {
    var definition;
    definition = {
      /*
      Apply a nested value..
      */

      applyValue: function(obj, property, value) {
        var av, nextProp, props;
        av = arguments.callee;
        if (obj == null) {
          throw "Cannot apply to null object the property:  " + property + " with value: " + value;
        }
        if (property.indexOf(".") === -1) {
          obj[property] = value;
        } else {
          props = property.split(".");
          nextProp = props.shift();
          av(obj[nextProp], props.join("."), value);
        }
        return null;
      }
    };
    return definition;
  });

}).call(this);
;angular.module('cs.directives')
  .directive('collapsablePanel', [
    function() {
      'use strict';

      return {
        transclude: true,
        restrict: 'E',
        template: '<div class="panel" ></div>',
        controller: function($scope, $element, $attrs) {
          var collapseVar;

          this.toggle = function() {
            $scope[collapseVar] = !$scope[collapseVar];
          }

          function isCollapsed(el) {
            return !el.hasClass('in');
          }

          if ($attrs.collapsed) {
            collapseVar = $attrs.collapsed;

            $scope.$watch(collapseVar,function(newVal) {
              var content = $element.find('.collapse');
              if (isCollapsed(content) != newVal) {
                content.collapse(newVal ? 'hide':'show');
              }
            });
          }
        },
        link: function(scope,$element,attrs,ctrl,$transclude){
          $transclude(scope, function(clone){
            $element.find('.panel').append(clone);
          })
        }
      };
    }
  ])
  .directive('panelHeading',[function(){
    return {
      replace: true,
      require: "^collapsablePanel",
      transclude: true,
      restrict: 'E',
      scope: {},
      template: [
        ' <div class="panel-heading">',
        '    <a href ng-click="onClick()" >',
        '    </a>',
        '</div>'].join('\n'),
      link: function($scope, $element, $attrs, collapsablePanel, $transclude) {
        $scope.onClick = function(){
          collapsablePanel.toggle();
        }

        $transclude($scope.$parent, function(clone) {
          $element.find('a').append(clone);
        });
      }
    };
  }])
  .directive('panelContent',[function(){
    return {
      require: "^collapsablePanel",
      replace: true,
      transclude: true,
      restrict: 'E',
      scope: {},
      template: [
        '<div id="collapse-{{$id}}" class="panel-collapse collapse in">',
        '  <div class="panel-body">',
        '  </div>',
        '</div>'].join('\n'),
      link: function(scope,$element,attrs,ctrl,$transclude) {
        $transclude(scope.$parent, function(clone) {
          $element.find('.panel-body').append(clone);
        });
      }
    };
  }]);
