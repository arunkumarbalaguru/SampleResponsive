$(document).on('pageinit', function() {
    let scrollViewHeight = window.outerHeight - $(".so-header").outerHeight();
    let scrollBottom = scrollViewHeight - $(".so-container").scrollTop();
    let triggerBottom = scrollBottom - (scrollBottom * .8);

    let pageToken = "";
    let getMessages = function() {
        var promise = new Promise(function(resolve, reject) {
            $.ajax({
                url: "http://message-list.appspot.com/messages?pageToken=" + pageToken
            }).done(function(response) {
                pageToken = response.pageToken;
                $.each(response.messages, function(index, item) {
                    let cloneCopy = $("#cloneCopy").clone();
                    cloneCopy.removeAttr("id");
                    cloneCopy.attr("id", item.id);
                    cloneCopy.removeClass("so-hide");
                    cloneCopy.find(".so-person-name").text(item.author.name);
                    let respDate = new Date(item.updated);
                    let currDate = new Date();
                    diffTime = currDate.getTime() - respDate.getTime();
                    diffDays = diffTime / (1000 * 3600 * 24);
                    if(diffDays > 365) {
                        displayDiff = Math.floor(diffDays / 365) + " year(s) ago";
                    } else if(diffDays < 31) {
                        displayDiff = diffDays + "day(s) ago";
                    } else {
                        let months = (currDate.getFullYear() - respDate.getFullYear()) * 12;
                        months -= respDate.getMonth();
                        months += currDate.getMonth();
                        displayDiff = months + " month(s) ago";
                    }
                    cloneCopy.find(".so-person-duration").text(displayDiff);
                    cloneCopy.find(".so-person-details p").text(item.content);
                    cloneCopy.find(".so-avatar").attr("src", item.author.photoUrl);
                    $(".so-container").append(cloneCopy);
                    bindActions(cloneCopy);
                });
                bindScroll();
                resolve();
            });
        });
        return promise;
    };
    let bindActions = function(oneElem) {
        $(oneElem).on("swiperight", function(event) {
            $(".so-row").removeClass("so-delete-case");
            $(event.target).closest(".so-row").addClass("so-delete-case");
        });
        $(oneElem).on("swipeleft", swipeleftHandler);
        function swipeleftHandler(event) {
            $(event.target).closest(".so-row").removeClass("so-delete-case");
        }
        $(oneElem).find(".so-delete").on("click", function(event) {
            $(event.target).closest(".so-row").remove();
        });
    }
    let bindScroll = function() {
        let isStop = false;
        $(".so-container").off("scroll").on("scroll", function() {
            if(isStop === true) {
                return;
            }
            var compareHeight = scrollBottom - $(".so-container").scrollTop();
            if(compareHeight < triggerBottom || compareHeight < 300) {
                let currDate = new Date();
                let displayDiff, diffTime, diffDays;
                var respData = getMessages();
                isStop = true;
                respData.then(function() {
                    scrollViewHeight = window.outerHeight - $(".so-header").outerHeight();
                    scrollBottom = scrollViewHeight - $(".so-container").scrollTop();
                    triggerBottom = scrollBottom - (scrollBottom * .8);
                    isStop = false;
                });
            }
        });
    }
    getMessages();
    
});
