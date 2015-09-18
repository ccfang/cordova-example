/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        var gkComponentsReady = $.Deferred();
        var deviceready = $.Deferred();
        $(document).on('gkComponentsReady', function() {
            gkComponentsReady.resolve();
        });

        $(document).on('deviceready', function() {
            deviceready.resolve();
        });

        $.when(gkComponentsReady, deviceready).done(function() {
            app.onDeviceReady();
        });
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        var uri = "http://portal.ezoui.com/event/multipart/gk/handler.save.go?fileId=./";

        var camera = $.gk.camera;
        var connection = $.gk.connection;
        var fileTransfer = $.gk.fileTransfer;
        var notification = $.gk.notification;

        $('#upload').on("click", function() {
            var options = {
                targetWidth: 400,
                targetHeight: 300
            };

            camera.getPicture(options, function(imageURI) {
                var uploadOptions = {
                    fileKey: "file",
                    fileName: imageURI.substr(imageURI.lastIndexOf('/') + 1),
                    mimeType: "image/jpeg"
                };

                if (connection.isCell()) {
                    notification.confirm("現在不是使用Wifi，確定要上傳嗎?", function(buttonIndex) {
                        if (buttonIndex === 1) {
                            fileTransfer.upload(imageURI, uri, uploadOptions, success);
                        }
                    }, "上傳確認");
                } else {
                    fileTransfer.upload(imageURI, uri, uploadOptions);
                }
            });
        });

        $('#photo').on('click', function() {
            var options = {
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY
            };
            camera.getPicture(options, function(imageURI) {
                $('#path').val(imageURI);
            });
        });

        $('#upload2').on("click", function() {
            if (connection.isCell()) {
                notification.confirm("現在不是使用Wifi，確定要上傳嗎?", function(buttonIndex) {
                    if (buttonIndex === 1) {
                        fileTransfer.upload($('#path').val(), uri, success);
                    }
                }, "上傳確認");
            } else {
                fileTransfer.upload($('#path').val(), uri);
            }
        });

        $('#download').on("click", function() {
            var uri = "http://portal.ezoui.com/fileupload/鋼友特約飯店.pdf";
            $.gk.file.getDirectory('Test', function(entry) {
                fileTransfer.download(uri, entry.fullPath + '/test.pdf', function(entry) {
                    $('#path2').val(entry.fullPath);
                    $.gk.toast.short('下載成功');
                });
            });
        });

        $('#open').on("click", function() {
            $.gk.fileOpener.open($('#path2').val());
        });

        function success(res) {
            $.gk.toast.short('上傳完成: Code=' + res.responseCode);
        }
    }
};