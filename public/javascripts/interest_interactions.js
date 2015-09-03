var completeSection = [false, false],
	actOneBtns = $('#actOnePanel input[type="checkbox"]'),
	actOnechecked = [],
	actTwoBtns = $('#actTwoPanel input');
	actTwochecked = [];

	actOneBtns.on('change', function (e) {
		if ($(e.target).prop('checked')) {
			actOnechecked.push($(e.target));
			if (actOnechecked.length === 2 ) {
				completeSection[0] = true;
				$('#ActTwo a').trigger('click');

			} else {
				//prevent early submission
				completeSection[0] = false;
			}
			if (actOnechecked.length > 2) {
				$(actOnechecked.shift()).prop('checked', false).parents().toggleClass('active');
			}
		} else {
			indexToDrop = actOnechecked.indexOf($(e.target));
			if (indexToDrop > -1) {
				actOnechecked.splice(1, indexToDrop);
			}
		}
	});

	actTwoBtns.on('change', function (e) {
		if (actTwochecked.indexOf($(e.target).prop('name')) == -1) {
			actTwochecked.push($(e.target).prop('name'));
		}
		if (actTwochecked.length >= 3) {
			completeSection[1] = true;
			$('#ActThree a').trigger('click');
		} else {
			//prevent early submission
			completeSection[1] = false;
		}
	});

	$('#ActThree a').on('click', function () {
		console.log(completeSection);
		if (completeSection[0] && completeSection[1]) {
			$('.nextStep').fadeIn();
		} else {
			$('.nextStep').hide();
		}
	});
