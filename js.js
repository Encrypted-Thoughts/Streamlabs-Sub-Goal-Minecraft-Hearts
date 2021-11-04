var tierCount = 0;
var progressCount = 1;
var slData = {};
var slSettings = {};
var tier1Limit = 110;
var tier2Limit = 220;
var heartCount = 0;

document.addEventListener('goalLoad', function(obj) {
	console.log(obj.detail);
	slSettings = obj.detail.settings;
	applySettings();

	$('#bar').empty();
	updateGlobarVars(obj);
	setBackground();

	for (let i=1; i <= slData.target; i++)
		addHeart(i);
});

document.addEventListener('goalEvent', function(obj) {
	console.log(obj.detail);
	updateGlobarVars(obj);
	setBackground();

	for (let i=1; i <= slData.target; i++)
		updateHeart(i);
});

function updateGlobarVars(obj){
	slData = obj.detail.amount;
	heartCount = Math.floor(slData.current / slSettings.custom_json.subs_per_heart.value);
	tier1Limit = slData.target * slData.target + slData.target;
	tier2Limit = tier1Limit * 2;
	tierCount = Math.floor(heartCount/tier1Limit);
	progressCount = Math.floor((heartCount-(tierCount * tier1Limit))/slData.target);
	console.log(tierCount + " " + tier1Limit + " " + tier2Limit + " " + progressCount);
}

function setBackground() {
	if(slSettings.custom_json.max_tier.value >= 8 && tierCount >= 8) 
		$('#bar').css("background", "var(--tier8-background)");
	else if(slSettings.custom_json.max_tier.value >= 7 && tierCount >= 7) 
		$('#bar').css("background", "var(--tier7-background)");
	else if(slSettings.custom_json.max_tier.value >= 6 && tierCount >= 6) 
		$('#bar').css("background", "var(--tier6-background)");
	else if(slSettings.custom_json.max_tier.value >= 5 && tierCount >= 5) 
		$('#bar').css("background", "var(--tier5-background)");
	else if(slSettings.custom_json.max_tier.value >= 4 && tierCount >= 4) 
		$('#bar').css("background", "var(--tier4-background)");
	else if(slSettings.custom_json.max_tier.value >= 3 && tierCount >= 3) 
		$('#bar').css("background", "var(--tier3-background)");
	else if(slSettings.custom_json.max_tier.value >= 2 && tierCount >= 2) 
		$('#bar').css("background", "var(--tier2-background)");
	else if(slSettings.custom_json.max_tier.value >= 1 && tierCount >= 1) 
		$('#bar').css("background", "var(--tier1-background)");
	else 
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
	if (slSettings.custom_json.max_tier.value === "8" && tierCount >= 8)
		return "heart8-outline";
	if (slSettings.custom_json.max_tier.value === "7" && tierCount >= 7)
		return "heart7-outline";
	if (slSettings.custom_json.max_tier.value === "6" && tierCount >= 6)
		return "heart6-outline";
	if (slSettings.custom_json.max_tier.value === "5" && tierCount >= 5)
		return "heart5-outline";
	if (slSettings.custom_json.max_tier.value === "4" && tierCount >= 4)
		return "heart4-outline";
	if (slSettings.custom_json.max_tier.value === "3" && tierCount >= 3)
		return "heart3-outline";
	if (slSettings.custom_json.max_tier.value === "2" && tierCount >= 2)
		return "heart2-outline";
	if (slSettings.custom_json.max_tier.value === "1" && tierCount >= 1)
		return "heart1-outline";

	if (progressCount >= i)
		return `heart${tierCount+1}-outline-special`;

	return `heart${tierCount+1}-outline`;
}

function getFillClass(i) {
	if (slSettings.custom_json.max_tier.value === "8" && tierCount >= 8)
		return "heart8-fill";
	if (slSettings.custom_json.max_tier.value === "7" && tierCount >= 7)
		return "heart7-fill";
	if (slSettings.custom_json.max_tier.value === "6" && tierCount >= 6)
		return "heart6-fill";
	if (slSettings.custom_json.max_tier.value === "5" && tierCount >= 5)
		return "heart5-fill";
	if (slSettings.custom_json.max_tier.value === "4" && tierCount >= 4)
		return "heart4-fill";
	if (slSettings.custom_json.max_tier.value === "3" && tierCount >= 3)
		return "heart3-fill";
	if (slSettings.custom_json.max_tier.value === "2" && tierCount >= 2)
		return "heart2-fill";
	if (slSettings.custom_json.max_tier.value === "1" && tierCount >= 1)
		return "heart1-fill";

	if (i <= (heartCount-(tierCount * tier1Limit))%slData.target)
		return `heart${tierCount+1}-fill`;

	return `heart${tierCount}-fill`
}

function getAnimateClass(i) {
	if (heartCount < slSettings.custom_json.animate_stop_threshold.value)
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
	
	document.documentElement.style.setProperty('--tier1-background', slSettings.custom_json.tier1_background.value);
	document.documentElement.style.setProperty('--heart1-primary', slSettings.custom_json.heart1_primary.value);
	document.documentElement.style.setProperty('--heart1-secondary', slSettings.custom_json.heart1_secondary.value);
	document.documentElement.style.setProperty('--heart1-shine', slSettings.custom_json.heart1_shine.value);
	document.documentElement.style.setProperty('--heart1-outline', slSettings.custom_json.heart1_outline.value);
	document.documentElement.style.setProperty('--heart1-outline-special', slSettings.custom_json.heart1_outline_special.value);
	
	document.documentElement.style.setProperty('--tier2-background', slSettings.custom_json.tier2_background.value);
	document.documentElement.style.setProperty('--heart2-primary', slSettings.custom_json.heart2_primary.value);
	document.documentElement.style.setProperty('--heart2-secondary', slSettings.custom_json.heart2_secondary.value);
	document.documentElement.style.setProperty('--heart2-shine', slSettings.custom_json.heart2_shine.value);
	document.documentElement.style.setProperty('--heart2-outline', slSettings.custom_json.heart2_outline.value);
	document.documentElement.style.setProperty('--heart2-outline-special', slSettings.custom_json.heart2_outline_special.value);
  
	document.documentElement.style.setProperty('--tier3-background', slSettings.custom_json.tier3_background.value);
	document.documentElement.style.setProperty('--heart3-primary', slSettings.custom_json.heart3_primary.value);
	document.documentElement.style.setProperty('--heart3-secondary', slSettings.custom_json.heart3_secondary.value);
	document.documentElement.style.setProperty('--heart3-shine', slSettings.custom_json.heart3_shine.value);
	document.documentElement.style.setProperty('--heart3-outline', slSettings.custom_json.heart3_outline.value);
	document.documentElement.style.setProperty('--heart3-outline-special', slSettings.custom_json.heart3_outline_special.value);
	
	document.documentElement.style.setProperty('--tier4-background', slSettings.custom_json.tier4_background.value);
	document.documentElement.style.setProperty('--heart4-primary', slSettings.custom_json.heart4_primary.value);
	document.documentElement.style.setProperty('--heart4-secondary', slSettings.custom_json.heart4_secondary.value);
	document.documentElement.style.setProperty('--heart4-shine', slSettings.custom_json.heart4_shine.value);
	document.documentElement.style.setProperty('--heart4-outline', slSettings.custom_json.heart4_outline.value);
	document.documentElement.style.setProperty('--heart4-outline-special', slSettings.custom_json.heart4_outline_special.value);
	
	document.documentElement.style.setProperty('--tier5-background', slSettings.custom_json.tier5_background.value);
	document.documentElement.style.setProperty('--heart5-primary', slSettings.custom_json.heart5_primary.value);
	document.documentElement.style.setProperty('--heart5-secondary', slSettings.custom_json.heart5_secondary.value);
	document.documentElement.style.setProperty('--heart5-shine', slSettings.custom_json.heart5_shine.value);
	document.documentElement.style.setProperty('--heart5-outline', slSettings.custom_json.heart5_outline.value);
	document.documentElement.style.setProperty('--heart5-outline-special', slSettings.custom_json.heart5_outline_special.value);
	
	document.documentElement.style.setProperty('--tier6-background', slSettings.custom_json.tier6_background.value);
	document.documentElement.style.setProperty('--heart6-primary', slSettings.custom_json.heart6_primary.value);
	document.documentElement.style.setProperty('--heart6-secondary', slSettings.custom_json.heart6_secondary.value);
	document.documentElement.style.setProperty('--heart6-shine', slSettings.custom_json.heart6_shine.value);
	document.documentElement.style.setProperty('--heart6-outline', slSettings.custom_json.heart6_outline.value);
	document.documentElement.style.setProperty('--heart6-outline-special', slSettings.custom_json.heart6_outline_special.value);
	
	document.documentElement.style.setProperty('--tier7-background', slSettings.custom_json.tier7_background.value);
	document.documentElement.style.setProperty('--heart7-primary', slSettings.custom_json.heart7_primary.value);
	document.documentElement.style.setProperty('--heart7-secondary', slSettings.custom_json.heart7_secondary.value);
	document.documentElement.style.setProperty('--heart7-shine', slSettings.custom_json.heart7_shine.value);
	document.documentElement.style.setProperty('--heart7-outline', slSettings.custom_json.heart7_outline.value);
	document.documentElement.style.setProperty('--heart7-outline-special', slSettings.custom_json.heart7_outline_special.value);
	
	document.documentElement.style.setProperty('--tier8-background', slSettings.custom_json.tier8_background.value);
	document.documentElement.style.setProperty('--heart8-primary', slSettings.custom_json.heart8_primary.value);
	document.documentElement.style.setProperty('--heart8-secondary', slSettings.custom_json.heart8_secondary.value);
	document.documentElement.style.setProperty('--heart8-shine', slSettings.custom_json.heart8_shine.value);
	document.documentElement.style.setProperty('--heart8-outline', slSettings.custom_json.heart8_outline.value);
	document.documentElement.style.setProperty('--heart8-outline-special', slSettings.custom_json.heart8_outline_special.value);
}