/*
MustafaMercan
 var _options = {
        screenBoxCount: { row: 4, col: 4 },
        lastClick: undefined,
        canvasId: "#game",
        coverImage: "cover_a.png",
        imageFolder: "game-Images",
        onAfterClick: undefined,
        onStartGame: undefined,
        onFinishGame: undefined,
        onAfterCheck: undefined,
        onSecondTimer:undefined

    }
    var game= new MemoryGame(_options);
    game.startGame()
    game.renderLayout()
    game.options//current options
    game.isFinishGame//true False

    _options.onAfterClick(cell, clickCount, score);
    _options.onAfterCheck(cell1, cell2, correct);
    _options.onSecondTimer(clickCount, score, (new Date() - startTime));
    _options.onFinishGame(clickCount, score, (stopTime - startTime));
    _options.onStartGame(startTime,_options);
*/

MemoryGame = function (options) {
    var clickCount = 0;
    var startTime = undefined;
    var stopTime = undefined;
    var isFinishGame = false;
    var score = 0;
    var shuffledArray= undefined;
    var gameTimer= undefined;
    var _options = {
        screenBoxCount: { row: 4, col: 4 },
        lastClick: undefined,
        canvasId: "#game",
        coverImage: "cover_a.png",
        imageFolder: "game-Images",
        onAfterClick: undefined,
        onStartGame: undefined,
        onFinishGame: undefined,
        onAfterCheck: undefined,
        onSecondTimer:undefined

    }
    if (options != undefined) {
        $.extend( _options, options );        
    }
    var boxCount = function () { return _options.screenBoxCount.row * _options.screenBoxCount.col }
    var renderLayout=function () {
        $(_options.canvasId).html("");
        var layOut = "";
        var imageIndex = 0;
        shuffledArray = imageArrayGenerate();
        for (row = 0; row < _options.screenBoxCount.row; row++) {
            layOut += "<div class='row' >";
            for (col = 0; col < _options.screenBoxCount.col; col++) {
                layOut += "<div class='cell' data-row=" + row + " data-col=" + col + " data-index=" + imageIndex + " data-show=false data-correct=false><img class='front' src='" + _options.imageFolder + "/" + _options.coverImage + "'/><img class='back' src='" + shuffledArray[imageIndex] + "' style='display:none;opacity: 0;' /></div>";
                imageIndex++;
            }
            layOut += "</div>"
        }
        $(_options.canvasId).html(layOut);
    }
    var imageArrayGenerate= function () {
        var imageArray = new Array(boxCount());

        for (i = 0; i <= (imageArray.length / 2) - 1; i++) {
            imageArray[i] = _options.imageFolder + "/" + (i + 1) + ".jpg";
            imageArray[imageArray.length - i - 1] = imageArray[i]
        }
        return shuffleArray(imageArray);
    }
    var bindClickEvent = function (bindEnable) {
        if (bindEnable) {
            $(_options.canvasId).find(".cell").on("click", cellClickEvent.bind(this));
        }
        else {
            $(_options.canvasId).find(".cell").off("click");
        }

    }
    var cellClickEvent= function (e) {
        var cell = $(e.delegateTarget);
        var showingCells = $(_options.canvasId).find(".cell[data-show=true][data-correct=false]");
        if (showingCells.length == 0) {
            clickCount++;
            showCell(cell);
        }
        else if (showingCells.length == 1 && showingCells.find(cell).length == 0) {
            clickCount++;
            showCell(cell);
            checkCard(showingCells.eq(0), cell);
        }
        else if (showingCells.length > 1 && showingCells.find(cell).length == 0) {
            clickCount++;
            hideCells(false);
            showCell(cell);
        }
        if (_options.onAfterClick != undefined) {
            _options.onAfterClick(cell, clickCount, score);
        }

    }
    var hideCells= function (correct) {
        $(_options.canvasId).find(".cell[data-show=true][data-correct=" + correct + "]").each(hideCell)
    }
    var hideCell= function (i, cell) {
        $(cell).attr("data-show", false);
        $(cell).attr("data-correct", false);
        $(cell).find(".front").show().animate({ opacity: 1 });
        $(cell).find(".back").hide().animate({ opacity: 0 });
    }
    var showCell= function (cell) {
        cell.attr("data-show", true);
        cell.find(".back").show().animate({ opacity: 1 });
        cell.find(".front").hide().animate({ opacity: 0 });
    }
    var getCellIndex= function (cell) {
        return parseInt(cell.data("index"));
    }
    var checkCard= function (cell1, cell2) {

        var correct = shuffledArray[getCellIndex(cell1)] == shuffledArray[getCellIndex(cell2)];
        if (correct) {
            cell1.attr("data-correct", true);
            cell2.attr("data-correct", true);
            score++;
        }
        if (score >= boxCount() / 2) {
            finishGame();
        }
        if (_options.onAfterCheck != undefined) {
            _options.onAfterCheck(cell1, cell2, correct);
        }
        return correct;
    }
    var finishGame = function () {
        bindClickEvent(false);
        stopTime = new Date();
        isFinishGame = true;
        clearInterval(gameTimer);
        if (_options.onFinishGame != undefined) {
            _options.onFinishGame(clickCount, score, (stopTime - startTime));
        }
    }
    var startGame= function () {
        renderLayout();
        clickCount = 0;
        isFinishGame = false;
        score = 0;
        bindClickEvent(true);
        startTime = new Date();
        if (_options.onStartGame != undefined) {
            _options.onStartGame(startTime,_options);
        }
        gameTimer=setInterval(function () {
            if (_options.onSecondTimer != undefined) {
                _options.onSecondTimer(clickCount, score, (new Date() - startTime));
            }
        },1000)
    }
    var shuffleArray = function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var rIndex = (Math.floor(Math.random() * Date.now()) % i);
            var temp = array[i];
            array[i] = array[rIndex];
            array[rIndex] = temp;
        }
        return array
    }

    return{
        startGame:startGame,
        renderLayout:renderLayout,
        options:_options,
        isFinishGame:isFinishGame
    }

}
