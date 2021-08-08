/**
 * Demo Emulation
 */
$(document).ready(function() {

    checkDevices($);

    console.log('Demo of Briso starting, click initialize button to start testing');

    // Listen to briso events
    $(document).on('briso-alert', function(e) {
        $('#briso-alerts ul').append('<li class="alert"> [' + new Date(e.detail.timestamp).toLocaleTimeString() + ']<b> [ ' + e.detail.type + '] : ' + '</b>' + e.detail.message + '</li>');
    });

    $('#initialize').click(function() {

        var userId = prompt('Provide user id for testing', '7777');
        var distinguisher_id = prompt('Provide the exam id for testing', '0000');

        // Initializing briso
        $.fn.briso().init({
            'brisoServer': 'https://ai.uat.examonline.in',
            'videoElementId': 'video1', // the id of the video element of the page
            'debug': true, // turn on/off for logging and debugging
            'apiId': 'eoae201318', // Unique Id assigned to you by Briso, without valid value monitoring will not start
            'contextId': '1234511', // The Id of the exam, so that logging can be done in context for efficient reporting later on
            'userDetails': { // The details of the user which has to be monitored
                userId: userId,
                distinguisher_id: distinguisher_id
            },
            'monitoring_interval': 7000, // (milliseconds) increase or decrease based on requirement, decreasing will cause more frames processed and lead to load on server
            'mediaToMonitor': {
                audio: false,
                video: true
            },
        });

        document.addEventListener('briso-server-connected', function(e) {
            $('#start-monitoring').attr('disabled', false);
        });
    });

    // Add User use case emulator
    $('#start-monitoring').click(function() {

        $.fn.briso().startMonitoring();

        $('#camera-control').attr('disabled', false);
        $('#pause-monitoring').attr('disabled', false);
        $('#end-monitoring').attr('disabled', false);
    });

    // Start and stop camera
    $('#camera-control').click(function() {

        let video = document.getElementById(($(this).attr('data-target')));

        if (video !== null) {
            if (video.paused) {
                startCameraFeed(video);
                video.play();
                $(this).html('Pause Camera');

            } else {
                video.pause();
                stopCameraFeed(video);
                $(this).html('Start Camera');
            }
        }
    });

    // Emulate pause monitoring
    $('#pause-monitoring').click(function() {
        $.fn.briso().pauseMonitoring();

        $(this).attr('disabled', true);
        $('#resume-monitoring').attr('disabled', false);
    });

    // Emulate resume monitoring
    $('#resume-monitoring').click(function() {
        $.fn.briso().resumeMonitoring();

        $(this).attr('disabled', true);
        $('#pause-monitoring').attr('disabled', false);
    });

    // Emulate end monitoring
    $('#end-monitoring').click(function() {

        $.fn.briso().stopMonitoring();

        $('#camera-control').attr('disabled', true);
        $('#pause-monitoring').attr('disabled', true);
        $('#end-monitoring').attr('disabled', true);
    });
});

// Helper to check access for the devices
function checkDevices($) {

    navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
            $('#camera-status').addClass('status-ok');
        })
        .catch(() => {
            $('#camera-status').addClass('status-not-ok');
        });

    navigator.mediaDevices.getUserMedia({ audio: true })
        .then((stream) => {
            $('#mic-status').addClass('status-ok');
        })
        .catch(() => {
            $('#mic-status').addClass('status-not-ok');
        });
}

function startCameraFeed(video) {

    navigator.mediaDevices.getUserMedia({ video: true }, video)
        .then(function(stream) {
            window.localStream = stream;
            video.srcObject = stream;
        })
        .catch(function(err) {
            $('#video-error').html('There was a problem with media initialization. Error: ' + err).css('visibility', 'visible');
        });
}

function stopCameraFeed(video) {
    localStream.getTracks().forEach((track) => {
        track.stop();
    });
}

// Clock Code - Only for Demo to match with the alert timestamp
function startTime() {

    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    var s = today.getSeconds();
    m = checkTime(m);
    s = checkTime(s);
    document.getElementById('clock').innerHTML = h + ':' + m + ':' + s;
    var t = setTimeout(startTime, 500);
}

function checkTime(i) {
    if (i < 10) {
        i = '0' + i;
    } // add zero in front of numbers < 10
    return i;
}
