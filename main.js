phina.globalize();

var SCREEN_WIDTH = 720;
var SCREEN_HEIGHT = 1280;
var TOTAL_ROUNDS = 5;
var USE_IMAGES = true;

var QUESTIONS = [
  {
    id: "shizari1",
    name: "シザリガー",
    isShizari: true,
    zoomImg: "assets/img/shizari1_zoom.png",
    fullImg: "assets/img/shizari1_full.png",
  },
  {
    id: "shizari2",
    name: "シザリガー",
    isShizari: true,
    zoomImg: "assets/img/shizari2_zoom.png",
    fullImg: "assets/img/shizari2_full.png",
  },
  {
    id: "shizari3",
    name: "シザリガー",
    isShizari: true,
    zoomImg: "assets/img/shizari3_zoom.png",
    fullImg: "assets/img/shizari3_full.png",
  },
  {
    id: "shizari4",
    name: "シザリガー",
    isShizari: true,
    zoomImg: "assets/img/shizari4_zoom.png",
    fullImg: "assets/img/shizari4_full.png",
  },
  {
    id: "shizari5",
    name: "シザリガー",
    isShizari: true,
    zoomImg: "assets/img/shizari5_zoom.png",
    fullImg: "assets/img/shizari5_full.png",
  },
  {
    id: "shizari6",
    name: "シザリガー",
    isShizari: true,
    zoomImg: "assets/img/shizari6_zoom.png",
    fullImg: "assets/img/shizari6_full.png",
  },
  {
    id: "heigani",
    name: "ヘイガニ",
    isShizari: false,
    zoomImg: "assets/img/heigani_zoom.png",
    fullImg: "assets/img/heigani_full.png",
  },
  {
    id: "krabby",
    name: "クラブ",
    isShizari: false,
    zoomImg: "assets/img/krabby_zoom.png",
    fullImg: "assets/img/krabby_full.png",
  },
  {
    id: "kingler",
    name: "キングラー",
    isShizari: false,
    zoomImg: "assets/img/kingler_zoom.png",
    fullImg: "assets/img/kingler_full.png",
  },
  {
    id: "makennkani",
    name: "マケンカニ",
    isShizari: false,
    zoomImg: "assets/img/makenkani_zoom.png",
    fullImg: "assets/img/makennkani_full.png",
  },
  {
    id: "kekenkani",
    name: "ケケンカニ(色違い)",
    isShizari: false,
    zoomImg: "assets/img/kekenkani_zoom.png",
    fullImg: "assets/img/kekenkani_full.png",
  },
  {
    id: "hitodeman",
    name: "ヒトデマン",
    isShizari: false,
    zoomImg: "assets/img/hitodeman_zoom.png",
    fullImg: "assets/img/hitodeman_full.png",
  },
  {
    id: "burosuta",
    name: "ブロスター(色違い)",
    isShizari: false,
    zoomImg: "assets/img/burosuta_zoom.png",
    fullImg: "assets/img/burosuta_full.png",
  },
  {
    id: "hassamu",
    name: "ハッサム",
    isShizari: false,
    zoomImg: "assets/img/hassamu_zoom.png",
    fullImg: "assets/img/hassamu_full.png",
  }
];

function buildAssets() {
  if (!USE_IMAGES) return {};
  var images = {};
  QUESTIONS.forEach(function(q) {
    images[q.id + "_zoom"] = q.zoomImg;
    images[q.id + "_full"] = q.fullImg;
  });
  return { image: images };
}

function shuffle(list) {
  var arr = list.slice();
  for (var i = arr.length - 1; i > 0; i -= 1) {
    var j = Math.floor(Math.random() * (i + 1));
    var tmp = arr[i];
    arr[i] = arr[j];
    arr[j] = tmp;
  }
  return arr;
}

function createDeck() {
  var shuffled = shuffle(QUESTIONS);
  var count = Math.min(TOTAL_ROUNDS, shuffled.length);
  return shuffled.slice(0, count);
}

phina.define("TitleScene", {
  superClass: "DisplayScene",
  init: function() {
    this.superInit({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
    this.backgroundColor = "#10232a";

    Label({
      text: "シザリガー？\nそれ以外？",
      fill: "#ffffff",
      fontSize: 56,
      align: "center",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(4));

    Label({
      text: "ズーム画像を見て\nシザリガーか判定！",
      fill: "#b9d4db",
      fontSize: 28,
      align: "center",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(7));

    Button({
      text: "START",
      width: 260,
      height: 90,
      fontSize: 32,
      fontColor: "#0e1a1f",
      fill: "#f7d154",
      stroke: "#fbe39a",
      strokeWidth: 4,
      cornerRadius: 12,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(11))
      .onpush = function() {
        var state = {
          deck: createDeck(),
          index: 0,
          correct: 0,
        };
        this.app.replaceScene(QuizScene({ state: state }));
      }.bind(this);

    Label({
      text: "5問チャレンジ！",
      fill: "#86a6b1",
      fontSize: 22,
      align: "center",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(13));
  },
});

phina.define("QuizScene", {
  superClass: "DisplayScene",
  init: function(params) {
    this.superInit({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
    this.backgroundColor = "#0b1418";

    this.state = params && params.state ? params.state : { deck: [], index: 0, correct: 0 };
    this.question = this.state.deck[this.state.index];

    Label({
      text: "Q " + (this.state.index + 1) + " / " + this.state.deck.length,
      fill: "#ffffff",
      fontSize: 28,
      align: "left",
    }).addChildTo(this).setPosition(this.gridX.span(2.5), this.gridY.span(1.5));

    this.card = DisplayElement().addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(6.5));

    RectangleShape({
      width: 420,
      height: 420,
      fill: "#14303a",
      stroke: "#2b5564",
      strokeWidth: 6,
      cornerRadius: 20,
    }).addChildTo(this.card);

    if (USE_IMAGES) {
      var sprite = Sprite(this.question.id + "_zoom").addChildTo(this.card);
      sprite.setSize(360, 360);
      sprite.setPosition(0, 0);
    } else {
      Label({
        text: "画像準備中",
        fill: "#7fb1be",
        fontSize: 28,
        align: "center",
      }).addChildTo(this.card);
    }

    Button({
      text: "シザリガー",
      width: 260,
      height: 90,
      fontSize: 28,
      fontColor: "#0e1a1f",
      fill: "#f07b7b",
      stroke: "#f5b0b0",
      strokeWidth: 4,
      cornerRadius: 12,
    }).addChildTo(this).setPosition(this.gridX.span(4), this.gridY.span(11))
      .onpush = function() {
        this.judge(true);
      }.bind(this);

    Button({
      text: "それ以外",
      width: 260,
      height: 90,
      fontSize: 28,
      fontColor: "#0e1a1f",
      fill: "#6fd4a6",
      stroke: "#b2ead1",
      strokeWidth: 4,
      cornerRadius: 12,
    }).addChildTo(this).setPosition(this.gridX.span(12), this.gridY.span(11))
      .onpush = function() {
        this.judge(false);
      }.bind(this);
  },

  judge: function(answerIsShizari) {
    var isCorrect = (answerIsShizari === this.question.isShizari);
    if (isCorrect) this.state.correct += 1;

    this.app.replaceScene(AnswerScene({
      question: this.question,
      isCorrect: isCorrect,
      state: this.state,
    }));
  },
});

phina.define("AnswerScene", {
  superClass: "DisplayScene",
  init: function(params) {
    this.superInit({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
    this.backgroundColor = "#10232a";

    var question = params.question;
    var isCorrect = params.isCorrect;
    this.state = params.state;
    var isLast = this.state.index >= this.state.deck.length - 1;

    Label({
      text: isCorrect ? "正解！" : "不正解",
      fill: isCorrect ? "#f7d154" : "#7fb1be",
      fontSize: 48,
      align: "center",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(2.5));

    this.card = DisplayElement().addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(7));

    RectangleShape({
      width: 520,
      height: 520,
      fill: "#14303a",
      stroke: "#2b5564",
      strokeWidth: 6,
      cornerRadius: 20,
    }).addChildTo(this.card);

    if (USE_IMAGES) {
      var sprite = Sprite(question.id + "_full").addChildTo(this.card);
      sprite.setSize(460, 460);
      sprite.setPosition(0, 0);
    } else {
      Label({
        text: "画像準備中",
        fill: "#7fb1be",
        fontSize: 28,
        align: "center",
      }).addChildTo(this.card);
    }

    Label({
      text: question.name,
      fill: "#ffffff",
      fontSize: 36,
      align: "center",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(11));

    Button({
      text: isLast ? "結果へ" : "次へ",
      width: 260,
      height: 90,
      fontSize: 28,
      fontColor: "#0e1a1f",
      fill: "#f7d154",
      stroke: "#fbe39a",
      strokeWidth: 4,
      cornerRadius: 12,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(13))
      .onpush = function() {
        this.state.index += 1;
        if (this.state.index >= this.state.deck.length) {
          this.app.replaceScene(ResultScene({ state: this.state }));
        } else {
          this.app.replaceScene(QuizScene({ state: this.state }));
        }
      }.bind(this);
  },
});

phina.define("ResultScene", {
  superClass: "DisplayScene",
  init: function(params) {
    this.superInit({ width: SCREEN_WIDTH, height: SCREEN_HEIGHT });
    this.backgroundColor = "#10232a";

    this.state = params && params.state ? params.state : { deck: [], correct: 0 };
    var total = this.state.deck.length;

    Label({
      text: "結果",
      fill: "#ffffff",
      fontSize: 56,
      align: "center",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(4));

    Label({
      text: "正解数: " + this.state.correct + " / " + total,
      fill: "#f7d154",
      fontSize: 40,
      align: "center",
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(7));

    Button({
      text: "もう一回",
      width: 260,
      height: 90,
      fontSize: 28,
      fontColor: "#0e1a1f",
      fill: "#f7d154",
      stroke: "#fbe39a",
      strokeWidth: 4,
      cornerRadius: 12,
    }).addChildTo(this).setPosition(this.gridX.center(), this.gridY.span(11))
      .onpush = function() {
        this.app.replaceScene(TitleScene());
      }.bind(this);
  },
});

phina.main(function() {
  var app = GameApp({
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    fit: true,
    domElement: document.getElementById("phina-canvas"),
    assets: buildAssets(),
  });

  app.replaceScene(TitleScene());
  app.run();
});

