var MemoryGame =
{
    screenBoxCount: { row: 2, col: 2 },
    boxCount: function () { return this.screenBoxCount.row * this.screenBoxCount.col },
    lastClick: undefined,
    canvasId: "#game",
    coverImage: "cover_a.png",
    imageFolder: "game-Images",
    clickCount: undefined,
    startTime: undefined,
    stopTime: undefined,
    isFinishGame: undefined,
    gameTimer: undefined,
    score: undefined,
    shuffledArray: undefined,
    onAfterClick: undefined,
    onStartGame: undefined,
    onFinishGame: undefined,
    onAfterCheck: undefined,
    renderLayout: function () {
        $(this.canvasId).html("");
        var layOut = "";
        var imageIndex = 0;
        this.shuffledArray = this.imageArrayGenerate();
        for (row = 0; row < this.screenBoxCount.row; row++) {
            layOut += "<div class='row' >";
            for (col = 0; col < this.screenBoxCount.col; col++) {
                layOut += "<div class='cell' data-row=" + row + " data-col=" + col + " data-index=" + imageIndex + " data-show=false data-correct=false><img class='front' src='" + this.imageFolder + "/" + this.coverImage + "'/><img class='back' src='" + this.shuffledArray[imageIndex] + "' style='display:none;opacity: 0;' /></div>";
                imageIndex++;
            }
            layOut += "</div>"
        }
        $(this.canvasId).html(layOut);
    },
    imageArrayGenerate: function () {
        var imageArray = new Array(this.boxCount());

        for (i = 0; i <= (imageArray.length / 2) - 1; i++) {
            imageArray[i] = this.imageFolder + "/" + (i + 1) + ".jpg";
            imageArray[imageArray.length - i - 1] = imageArray[i]
        }
        return this.shuffleArray(imageArray);
    },
    bindClickEvent: function (enable) {
        if (enable) {
            $(this.canvasId).find(".cell").on("click", this.cellClickEvent.bind(this));
        }
        else {
            $(this.canvasId).find(".cell").off("click");
        }

    },
    cellClickEvent: function (e) {
        var cell = $(e.delegateTarget);
        var showingCells = $(this.canvasId).find(".cell[data-show=true][data-correct=false]");
        if (showingCells.length == 0) {
            this.clickCount++;
            this.showCell(cell);
        }
        else if (showingCells.length == 1 && showingCells.find(cell).length == 0) {
            this.clickCount++;
            this.showCell(cell);
            this.checkCard(showingCells.eq(0), cell);
        }
        else if (showingCells.length > 1 && showingCells.find(cell).length == 0) {
            this.clickCount++;
            this.hideCells(false);
            this.showCell(cell);
        }
        if (this.onAfterClick != undefined) {
            this.onAfterClick(cell, this.clickCount, this.score);
        }

    },
    hideCells: function (correct) {
        $(this.canvasId).find(".cell[data-show=true][data-correct=" + correct + "]").each(this.hideCell)
    },
    hideCell: function (i, cell) {
        $(cell).attr("data-show", false);
        $(cell).attr("data-correct", false);
        $(cell).find(".front").show().animate({ opacity: 1 });
        $(cell).find(".back").hide().animate({ opacity: 0 });
    },
    showCell: function (cell) {
        cell.attr("data-show", true);
        cell.find(".back").show().animate({ opacity: 1 });
        cell.find(".front").hide().animate({ opacity: 0 });
    },
    getCellIndex: function (cell) {
        return parseInt(cell.data("index"));
    },
    checkCard: function (cell1, cell2) {

        var correct = this.shuffledArray[this.getCellIndex(cell1)] == this.shuffledArray[this.getCellIndex(cell2)];
        if (correct) {
            cell1.attr("data-correct", true);
            cell2.attr("data-correct", true);
            this.score++;
        }
        if (this.score >= this.boxCount() / 2) {
            this.finishGame();
        }
        if (this.onAfterCheck != undefined) {
            this.onAfterCheck(cell1, cell2, correct);
        }
        return correct;
    },
    finishGame: function () {
        this.bindClickEvent(false);
        this.stopTime = new Date();
        this.isFinishGame = true;
        if (this.onFinishGame != undefined) {
            this.onFinishGame(this.clickCount, this.score, (this.stopTime - this.startTime));
        }
    },
    startGame: function () {
        this.renderLayout();
        this.clickCount = 0;
        this.isFinishGame = false;
        this.score = 0;
        this.bindClickEvent(true);
        this.startTime = new Date();
        if (this.onStartGame != undefined) {
            this.onStartGame(this.startTime);
        }
    },
    shuffleArray: function (array) {
        for (var i = array.length - 1; i > 0; i--) {
            var rIndex = (Math.floor(Math.random() * Date.now()) % i);
            var temp = array[i];
            array[i] = array[rIndex];
            array[rIndex] = temp;
        }
        return array
    },

}