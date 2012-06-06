
            window.log=function(){log.history=log.history||[];log.history.push(arguments);if(this.console){console.log(Array.prototype.slice.call(arguments))}};

$(function() {
    $("body")[0].ondragstart = function() { return false; };
    $("#filedropper")[0].ondragstart = function() { return false; };
    var opts = {
        readAsMap: {
            '.*': 'DataURL'
        },
        dragClass: "filedrop",
        on: {
            error: function() {
                alert("You must run this on a webserver to get results");
            },
            load: function (e, file) {
                var data = e.target.result;
                GradientCalc.findGrad(data, function(grad) {
                    var css = grad.toCss();
                    $("#grad").val(css);
                    $("#filedropper").attr("style", css);
                });
            }
        }
    };

    $("body").fileReaderJS(opts).fileClipboard(opts);

    for (var i = 0; i <= 90; i++) {
        $("#samples").append("<tr>" +
            "<td>" +
                "<img src='gradients/generic/" + i + ".png' />" +
            "<td>" +
                "<div class='preview'></div>" +
            "</td>" +
            "<td>" +
            "<textarea class='css'></textarea>" +
        "</td>");
    }

    $("#samples img").load(function(e) {
        var img = this;
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        var gradCss = GradientCalc.findGradFromCanvas(canvas).toCss();
        var preview = $(img).parent().siblings().find(".preview");
        var css = $(img).parent().siblings().find(".css");
        preview.attr("style", gradCss);
        css.val(gradCss);
    });
});