var tierCount = 0;
var progressCount = 1;
var slData = {};
var slSettings = {};
var tierLimit = 110;
var heartAmount = 100;
var totalHearts = 0;

document.addEventListener('goalLoad', function(obj) {
	console.log(obj.detail);
	slSettings = obj.detail.settings;
	applySettings();

	$('#bar').empty();
	updateGlobarVars(obj);
	setBackground();

	for (let i=1; i <= heartAmount; i++)
		addHeart(i);
});

document.addEventListener('goalEvent', function(obj) {
	console.log(obj.detail);
	updateGlobarVars(obj);
	setBackground();

	for (let i=1; i <= heartAmount; i++)
		updateHeart(i);
});

function updateGlobarVars(obj){
	slData = obj.detail.amount;
	heartAmount = slSettings.custom_json.heart_amount.value;
	totalHearts = Math.floor(slData.current / slSettings.custom_json.subs_per_heart.value);
	tierLimit = heartAmount ** 2;
	if (slSettings.custom_json.rank_up_point.value === "after_last")
		tierLimit += heartAmount;
	tierCount = Math.floor(totalHearts/tierLimit);
	progressCount = Math.floor((totalHearts-(tierCount * tierLimit))/heartAmount);
}

function setBackground() {
	for(var j = slSettings.custom_json.max_tier.value; j > 0; j--) {
		if(slSettings.custom_json.max_tier.value >= j && tierCount >= j)  {
			$('#bar').css("background", `var(--tier${j}-background)`);
			return;
		}
	}
	$('#bar').css("background", "var(--tier0-background)");
}

function addHeart(i) {
	$('#bar').append(`<div id='heart-container-${i}' class='heart-container ${getAnimateClass(i)}'></div>`);
	
	$(`#heart-container-${i}`).append(`<div id='outline-block-${i}' class='block'></div>`);
	$(`#outline-block-${i}`).append(
		`<span id='heart-outline-${i}' class='heart ${getOutlineClass(i)}'></span>`
	);
	
	$(`#heart-container-${i}`).append(`<div id='fill-block-${i}' class='block'></div>`);
	$(`#fill-block-${i}`).append(
		`<span id='heart-fill-${i}' class='heart ${getFillClass(i)}'></span>`
	);
}

function updateHeart(i) {
	$(`#heart-container-${i}`).removeClass();
	$(`#heart-outline-${i}`).removeClass();
	$(`#heart-fill-${i}`).removeClass();
	
	$(`#heart-container-${i}`).addClass(`heart-container ${getAnimateClass(i)}`);
	$(`#heart-outline-${i}`).addClass(`heart ${getOutlineClass(i)}`);
	$(`#heart-fill-${i}`).addClass(`heart ${getFillClass(i)}`);
}

function getOutlineClass(i) {
	for(var j = slSettings.custom_json.max_tier.value; j > 0; j--) {
		if (slSettings.custom_json.max_tier.value === j && tierCount >= j)
			return `heart${j}-outline`;
	}

	if (progressCount >= i)
		return `heart${tierCount+1}-outline-special`;

	return `heart${tierCount+1}-outline`;
}

function getFillClass(i) {

	for(var j = slSettings.custom_json.max_tier.value; j > 0; j--) {
		if (slSettings.custom_json.max_tier.value === j && tierCount >= j)
			return `heart${j}-fill`;
	}

	if (i <= (totalHearts-(tierCount * tierLimit))%heartAmount)
		return `heart${tierCount+1}-fill`;

	return `heart${tierCount}-fill`
}

function getAnimateClass(i) {
	if (totalHearts < slSettings.custom_json.animate_stop_threshold.value)
		return `animate__animated animate__${slSettings.custom_json.animate_type_begin.value} animate__infinite animate__delay-${i%3}s`;
	if (tierCount >= slSettings.custom_json.max_tier.value)
		return `animate__animated animate__${slSettings.custom_json.animate_type_end.value} animate__infinite animate__delay-${i%3}s`;
	
	return "";
}

function applySettings() {
	document.documentElement.style.setProperty('--bar-bevel', slSettings.custom_json.bar_bevel.value + "px");
	document.documentElement.style.setProperty('--bar-border-color', slSettings.custom_json.bar_border_color.value);
	document.documentElement.style.setProperty('--bar-border-style', slSettings.custom_json.bar_border_style.value);
	document.documentElement.style.setProperty('--bar-border-thickness', slSettings.custom_json.bar_border_thickness.value + "px");
	document.documentElement.style.setProperty('--animate-duration', slSettings.custom_json.animate_duration.value + "ms");
	document.documentElement.style.setProperty('--animate-delay', slSettings.custom_json.animate_delay.value + "ms");

	document.documentElement.style.setProperty('--tier0-background', slSettings.custom_json.empty_background.value);
	document.documentElement.style.setProperty('--heart0-primary', slSettings.custom_json.empty_primary.value);
	document.documentElement.style.setProperty('--heart0-secondary', slSettings.custom_json.empty_primary.value);
	document.documentElement.style.setProperty('--heart0-shine', slSettings.custom_json.empty_primary.value);
	for(var i = 1; i <= slSettings.custom_json.max_tier.value; i++) {
		document.documentElement.style.setProperty(`--tier${i}-background`, slSettings.custom_json[`tier${i}_background`].value);
		document.documentElement.style.setProperty(`--heart${i}-primary`, slSettings.custom_json[`heart${i}_primary`].value);
		document.documentElement.style.setProperty(`--heart${i}-secondary`, slSettings.custom_json[`heart${i}_secondary`].value);
		document.documentElement.style.setProperty(`--heart${i}-shine`, slSettings.custom_json[`heart${i}_shine`].value);
		document.documentElement.style.setProperty(`--heart${i}-outline`, slSettings.custom_json[`heart${i}_outline`].value);
		document.documentElement.style.setProperty(`--heart${i}-outline-special`, slSettings.custom_json[`heart${i}_outline_special`].value);
	}
}