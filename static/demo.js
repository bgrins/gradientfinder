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
                GradientFinder.fromUrl(data, function(grad) {
                    if (grad) {
                        var css = grad.toCss();
                        $("#grad").val(css).height(150);
                        $("#filedropper").attr("style", css);
                        $("#uploaded-image").attr("src", data);
                        $("#uploaded-image-container").show();
                        $("#error").hide();
                    }
                    else {
                        $("#error").show();
                        $("#uploaded-image-container").hide();
                    }
                });
            }
        }
    };

    $("body").fileReaderJS(opts).fileClipboard(opts);

    var first = true;
    $("#showExamples").click(function(e) {
        e.preventDefault();
        if (first) {
            for (var i = 0; i <= 90; i+=5) {
                $("#samples").append("<tr>" +
                    "<td>" +
                        "<img data-src='gradients/generic/" + i + ".png' />" +
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

                var grad = GradientFinder.fromCanvas(canvas);
                if (grad) {
                    var preview = $(img).parent().siblings().find(".preview");
                    var css = $(img).parent().siblings().find(".css");
                    preview.attr("style", grad.toCss());
                    css.val(grad.toCss());
                }
            });

            $("#samples img").attr("src", function() {
                return $(this).data("src");
            });
        }

        first = false;
        if ($("#example-container").is(":visible")) {
            $("#example-container").hide();
            $(this).text("View");
        }
        else {
            $("#example-container").show();
            $(this).text("Hide");
        }
    });
});