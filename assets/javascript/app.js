//to start game: need timer at 30 - new question displayed - options filled in for guessing
//clear timeInt if question answered!
//timer cannot stop and reset... unless it reaches 0
// TURN ON RUN GAME AT THE BOTTOM

var Game = {
  option1: $("#1"),
  option2: $("#2"),
  option3: $("#3"),
  option4: $("#4"),
  questionSpace: $("#question"),
  startButton: $("#start-button"),
  posterSpace: $("#poster-space"),
  qRight: 0,
  qWrong: 0,
  currentCorrectAnswer: "",
  currentPoster: "",
  currentTime: 0,
  questionTitles: [],
  correctAnswers: [],
  incorrectAnswers: [
    1995,
    1991,
    1999,
    2011,
    2005,
    2000,
    2003,
    1980,
    1983,
    1989,
    1987
  ],
  posters: [],
  ajaxSearches: [
    "t=the+revenant",
    "t=pineapple+express",
    "t=donnie+darko",
    "t=jurassic+park"
  ],
  timer: $("#timer"),
  timeInt: 0,
  setTimer: function() {
    Game.currentTime = 20;
    Game.timer.text("Time: " + Game.currentTime);
    Game.timeInt = setInterval(function() {
      if (Game.currentTime === 0) {
        clearInterval(Game.timeInt);
        Game.currentTime = 20;
        Game.showAnswer();
        Game.qWrong++;
      } else {
        Game.currentTime--;
        Game.timer.text("Time: " + Game.currentTime);
      }
    }, 1000);
    $("h4").show();
  },
  grabInfo: function() {
    for (var i = 0; i < Game.ajaxSearches.length; i++) {
      $.ajax({
        url:
          "https://www.omdbapi.com/?" +
          Game.ajaxSearches[i] +
          "&plot=short&apikey=trilogy",
        method: "GET"
      }).then(function(response) {
        Game.correctAnswers.push(response.Year);
        Game.posters.push(response.Poster);
        Game.questionTitles.push(response.Title);
      });
    }
  },
  populateQA: function() {
    Game.setTimer();
    Game.posterSpace.hide();
    var i = Math.floor(Math.random() * Game.questionTitles.length);
    Game.questionSpace.text(
      "What year did " + Game.questionTitles[i] + " come out?"
    );
    Game.questionTitles.splice(i, 1);
    Game.currentCorrectAnswer = Game.correctAnswers[i];
    Game.currentPoster = Game.posters[i];
    Game.posters.splice(i, 1);
    var answerPool = [];
    answerPool.push(Game.correctAnswers[i]);
    Game.correctAnswers.splice(i, 1);
    for (var j = 0; j < 3; j++) {
      var x = Math.floor(Math.random() * Game.incorrectAnswers.length);
      answerPool.push(Game.incorrectAnswers[x]);
    }
    console.log(answerPool);
    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }
    shuffleArray(answerPool);
    console.log(answerPool);
    Game.option1.text(answerPool[0]);
    Game.option2.text(answerPool[1]);
    Game.option3.text(answerPool[2]);
    Game.option4.text(answerPool[3]);
    $("h2").show();
    $("h3").show();
  },
  showEndScreen: function() {
    Game.startButton.html("Retry?");
    Game.startButton.show();
    Game.posterSpace.hide();
    $("h2").hide();
    $("h3").hide();
    $("h4").hide();
    Game.option1.text("You got " + Game.qRight + " question(s) correct!");
    Game.option2.text("You got " + Game.qWrong + " question(s) wrong :(");
    Game.option1.show();
    Game.option2.show();
    Game.qRight = 0;
    Game.qWrong = 0;
    Game.grabInfo();
  },
  showAnswer: function() {
    Game.timer.hide();
    Game.posterSpace.show();
    Game.posterSpace.attr("src", Game.currentPoster);
    Game.option1.text(Game.currentCorrectAnswer);
    Game.option2.hide();
    Game.option3.hide();
    Game.option4.hide();
    if (Game.questionTitles.length < 1) {
      setTimeout(Game.showEndScreen, 3000);
    } else {
      setTimeout(Game.populateQA, 3000);
    }
  },
  runGame: function() {
    Game.startButton.show();
    $("h2").hide();
    $("h3").hide();
    $("h4").hide();
    Game.grabInfo();
    Game.startButton.on("click", function() {
      Game.populateQA();
      Game.startButton.hide();
    });
    $("h3").on("click", function() {
      clearInterval(Game.timeInt);
      if ($(this).text() === Game.currentCorrectAnswer) {
        Game.showAnswer();
        Game.qRight++;
        Game.questionSpace.text("That's correct!");
      } else {
        Game.showAnswer();
        Game.qWrong++;
        Game.questionSpace.text("Oh, not quite!");
      }
    });
  }
};
Game.runGame();
