document.addEventListener('DOMContentLoaded', function() {

	const winModal = document.querySelector('#win-modal');
	const modalExit = winModal.querySelector('#close-modal');
	const modalYes = winModal.querySelector('#yes');
	const modalNo = winModal.querySelector('#no');
	const startScreen = document.querySelector('#start-overlay');
	const gameHeader = document.querySelector('#game-header');
	const game = document.querySelector('#memory-game');

	/*
	 *
	 * START SCREEN
	 *
	 */

	const startGame = function() {
		startTimer();
		this.parentNode.remove();
	}

	/*
	 *
	 * TIMER
	 *
	 */

	let secondCounter;
	const startTimer = function() {


		/*** second counter ***/
		const secSpan = gameHeader.querySelector('#seconds');
		let startSeconds = new Date();
		let endSeconds = new Date();
		let secCountUp;

		startSeconds.setSeconds(0);
		endSeconds.setSeconds(59);

		secondCounter = setInterval(function() {
			endSeconds.setSeconds((endSeconds.getSeconds()) + 1);
			secCountUp = (endSeconds.getSeconds() - startSeconds.getSeconds());


			// add minute once 60 seconds have passed
			// and update minute span

			if (secCountUp === 0) {
				minCountUp = endMinutes.getMinutes() - startMinutes.getMinutes();

				endMinutes.setMinutes((endMinutes.getMinutes()) + 1);

				minSpan.innerHTML = minCountUp;
			}

			secSpan.innerHTML = secCountUp;


		}, 1000);

		/*** minute counter ***/
		const minSpan = gameHeader.querySelector('#minutes');
		let startMinutes = new Date();
		let endMinutes = new Date();

		startMinutes.setMinutes(0);
		endMinutes.setMinutes(0);



	}

	// reset timer
	const resetTimer = function() {
		clearInterval(secondCounter);
		startTimer();
	}




	/*
	 *
	 * SHUFFLING
	 *
	 */

	const shuffle = function() {
		let oldCards = Array.from(document.querySelectorAll('.card'));
		const newCards = [];
		let num = '';

		// generate random number
		// max depends on how many total elements in oldCards
		// add randomly selected card to new array,
		// then delete it from old array

		for (let i = oldCards.length; i > 0; i--) {
			num = Math.floor(Math.random() * (oldCards.length));
			newCards.push(oldCards[num]);
			oldCards.splice(num, 1);
		}
		for (const card of newCards) {
			game.appendChild(card);
		}
	}

	shuffle();

	/*
	 *
	 * GAME LOGIC 
	 *
	 */

	const modalRating = winModal.querySelector('#rating-result');
	const modalTime = winModal.querySelector('#time-result');
	const modalCount = winModal.querySelector('#counter-result');
	let card1 = '';
	let card2 = '';


	const match = function(e) {

		//store clicked cards as vars
		/*since vars reset after both are assigned and tested,
			we can track first and second clicks
			by using vars as conditionals */

		if (!card1 && !card2) {
			card1 = e.target.classList[1];
			game.querySelector('.' + card1).classList.remove('hide');
		} else if (card1 && !card2) {
			card2 = e.target.classList[1];
			game.querySelector('.' + card2).classList.remove('hide');

			//only update counter if cards are different
			if (card1 !== card2) {
				updateCounter();
			}
		}



		// test for match

		const letter = /(a|b)$/;
		const letterA = /card\da/;
		const letterB = /card\db/;
		let hiddenCards;

		// test for same card #, then different letter

		if ((card1.replace(letter, '') === card2.replace(letter, ''))
				&& ((letterA.test(card1) && letterB.test(card2)) 
					|| (letterB.test(card1) && letterA.test(card2)))) { 

			const matchingCards = game.querySelectorAll( '.' + (card1.replace(letter, '').toString()));

			// loop through each match, set visibility to hidden

			for (var i = 0; matchingCards.length > i; i++) {
				matchingCards[i].style.visibility = 'hidden';
			}

			// check if user has won

			hiddenCards = game.querySelectorAll('.card[style="visibility: hidden;"]');

			if (hiddenCards.length === 16) {

				clearInterval(secondCounter);

				/*
				 *
				 * CONGRATS MODAL
				 *
				 */

				winModal.style.display = '';

				modalRating.innerHTML = gameHeader.querySelector('#rating').innerHTML;
				modalTime.innerHTML = gameHeader.querySelector('#minutes').innerHTML + ' minutes and ' + 
					gameHeader.querySelector('#seconds').innerHTML + ' seconds ';
				modalCount.innerHTML = gameHeader.querySelector('#counter').innerHTML;


			}


		}



		//reset card vars after cards have been tested

		if (card1 && card2) {
			updateRating();
			window.setTimeout(function() {
				game.querySelector('.' + card1).classList.add('hide');
				game.querySelector('.' + card2).classList.add('hide');
				card1 = '';
				card2 = '';
			}, 500);
		}
	}

	/*
	 *
	 * RESET GAME
	 *
	 */

	// undo hiding the cards
	const resetGame = function() {

		shuffle();
		resetTimer();

		const cards = game.querySelectorAll('.card');

		// loop through each card, reset visibility, showing cards again
		for (const card of cards) {
			card.style.visibility = '';
		}

		gameHeader.querySelector('#rating').innerHTML = '★ ★ ★';

		//reset count
		count = 0;
		gameHeader.querySelector('#moves').innerHTML = 0;

	}


	/*
	 *
	 * UPDATE COUNTER
	 *
	 */

	let movesSpan;
	let count = 0;
	const updateCounter = function() {
		movesSpan = gameHeader.querySelector('#moves');
		count += 1;
		movesSpan.innerHTML = count;

		movesSpan.innerHTML = count;
	};

	/*
	 *
	 * STAR RATING
	 *
	 */

	const updateRating = function() {
		const starRating = gameHeader.querySelector('#rating');

		if (count === 14) {
			starRating.innerHTML = '★ ★ ☆';
		} else if (count === 19) {
			starRating.innerHTML = '★ ☆ ☆';
		}
	}

	/*
	 *
	 * PLAY AGAIN
	 *
	 */

	const yes = function() {
		winModal.style.display = 'none';
		resetGame();
	};

	const no = function() {
		modalYes.remove();
		modalNo.remove();
		winModal.querySelector('p').innerHTML = 'Thanks for playing!';
	};





	game.addEventListener('click', match);
	startScreen.querySelector('#start-game-button').addEventListener('click', startGame);
	gameHeader.querySelector('#reset').addEventListener('click', resetGame);
	modalExit.addEventListener('click', yes);
	modalYes.addEventListener('click', yes);
	modalNo.addEventListener('click', no);



});