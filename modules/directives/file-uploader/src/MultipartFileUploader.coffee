###
Taken from: 
https://github.com/edeustace/inplace-image-changer
###

if !XMLHttpRequest.prototype.sendAsBinary
  XMLHttpRequest.prototype.sendAsBinary = (dataStr)->
    byteValue = (x)->
      x.charCodeAt(0) & 0xff

    ords = Array.prototype.map.call dataStr, byteValue
    ui8a = new Uint8Array ords
    @send ui8a.buffer
    null

window.com || (window.com = {})
com.ee || (com.ee = {})
com.ee.v2 || (com.ee.v2 = {})


### 
    Prevents a RangeError from occuring for large images.
    see:  http://stackoverflow.com/questions/12710001/how-to-convert-uint8-array-to-base64-encoded-string/12713326#12713326
###
com.ee.v2.binaryArrayToString = (buffer) ->
  arr = new Uint8Array(buffer)
  CHUNK_SIZE = 0x8000 #arbitrary number
  index = 0
  length = arr.length
  result = ''
  slice = null
  while index < length 
    slice = arr.subarray(index, Math.min(index + CHUNK_SIZE, length))
    result += String.fromCharCode.apply(null, slice)
    index += CHUNK_SIZE
  
  result 

###
Simplifies the xhr upload api
###
class com.ee.XHRWrapper

  constructor: (@file, @formBody, @url, @name, @options) ->

    @options = @options || {}

    now = new Date().getTime()
    @request = new XMLHttpRequest()
    @request.upload.index = 0
    withCredentials = if @options.withCredentials? then @options.withCredentials else true
    @request.withCredentials = withCredentials 
    @request.upload.file = @file
    @request.upload.downloadStartTime = now
    @request.upload.currentStart = now
    @request.upload.currentProgress = 0
    @request.upload.startData = 0
    @request.upload.addEventListener("progress", @options.onUploadProgress, false) if @options.onUploadProgress?
    @request.upload.addEventListener("error", @options.onUploadFailed, false) if @options.onUploadFailed?
    @request.upload.addEventListener("abort", @options.onUploadCanceled, false) if @options.onUploadCanceled?
    @request.open "POST", @url, true
    @request.setRequestHeader "Accept", "application/json"

    @request.onload = =>
      if [200..204].indexOf(@request.status) == -1
        @options.onUploadFailed(@request) if @options.onUploadFailed?
      else 
        if @options.onUploadComplete?
          @options.onUploadComplete @request.responseText, @request.status

  setRequestHeader: (name, value) ->
    @request.setRequestHeader name, value
    null

  beginUpload: ->
    if @options.onLoadStart? 
      @options.onLoadStart()

    if (typeof(@formBody) == 'string')
      #convert to ArrayBuffer via sendAsBinary
      @request.sendAsBinary @formBody
    else 
      @request.send @formBody

    null

class com.ee.v2.RawFileUploader
  
  constructor: (@file, @url, @name, @options) ->
    reader = new FileReader()
    
    reader.onload = (e) =>
      @binaryData = e.target.result 
      @xhr = new com.ee.XHRWrapper(@file, @binaryData, @url, @name, @options)
      @xhr.setRequestHeader "Accept", "application/json"
      @xhr.setRequestHeader "Content-Type", "application/octet-stream"
      @xhr.beginUpload()

    reader.readAsArrayBuffer(@file)

###
Build up a multipart form data request body
###
class com.ee.v2.MultipartFileUploader

  constructor: (@file, @url, @name, @options) ->
    
    reader = new FileReader()

    reader.onload = (e) =>
      @binaryData = e.target.result 
      boundary = "------multipartformboundary-com-ee-mpfu"
      @rawData = @mkBinaryString(@binaryData)
      formBody = @_buildMultipartFormBody @file, @rawData, boundary
      @xhr = new com.ee.XHRWrapper(@file, formBody, @url, @name, @options)
      @xhr.setRequestHeader 'content-type', "multipart/form-data; boundary=#{boundary}"
      @xhr.setRequestHeader "Accept", "application/json"
      @xhr.beginUpload()
    
    reader.readAsArrayBuffer(@file)
  
  mkBinaryString: (buffer) -> com.ee.v2.binaryArrayToString(buffer) 

  _buildMultipartFormBody: (file, fileBinaryData, boundary) ->
    formBuilder = new com.ee.MultipartFormBuilder(boundary)
    params = @options.additionalData
    fileParams = [
      file : file
      data : fileBinaryData
      paramName : @name
    ]
    formBuilder.buildMultipartFormBody params, fileParams, boundary

###
Place the binary data directly into the request body.
###
class @om.ee.RawFileUploader
  constructor: (@file, @binaryData, @url, @name, @options) ->
    @xhr = new com.ee.XHRWrapper(@file, @binaryData, @url, @name, @options )
    @xhr.setRequestHeader "Accept", "application/json"
    @xhr.setRequestHeader "Content-Type", "application/octet-stream"
  
  beginUpload: -> @xhr.beginUpload() 


###
Build up a multipart form data request body
###
class com.ee.MultipartFileUploader
  constructor: (@file, @binaryData, @url, @name, @options) ->
    uid = Math.floor( Math.random() * 100000 )
    boundary = "------multipartformboundary#{uid}"

    formBody = @_buildMultipartFormBody @file, @binaryData, boundary
    @xhr = new com.ee.XHRWrapper(@file, formBody, @url, @name, @options)
    @xhr.setRequestHeader 'content-type', "multipart/form-data; boundary=#{boundary}"
    @xhr.setRequestHeader "Accept", "application/json"

  beginUpload: -> @xhr.beginUpload()
    
  _buildMultipartFormBody: (file, fileBinaryData, boundary) ->
    formBuilder = new com.ee.MultipartFormBuilder(boundary)
    params = @options.additionalData
    fileParams = [
      file : file
      data : fileBinaryData
      paramName : @name
    ]
    formBuilder.buildMultipartFormBody params, fileParams, boundary