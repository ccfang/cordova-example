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
        var $path = $('#path');
        var $newPath = $('#newPath');

        $('#video').on("click", function() {
            $.gk.capture.captureVideo(function(mediaFile) {
                $path.val(mediaFile[0].fullPath);
                $newPath.val('Test/' + mediaFile[0].name);
            });
        });

        $('#moveTo').on("click", function() {
            $.gk.file.moveFileTo($path.val(), $newPath.val(), function(entry) {
                $.gk.toast.long('影片搬移成功: ' + entry.fullPath);
            }, function(error) {
                $.gk.toast.short('影片搬移失敗: ' + $.gk.file.getErrorText(error.code));
            });
        });
    }
};