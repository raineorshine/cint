$(function() {
	$(".mouseover")
		.live("mouseover", function() { $(this).addClass("active"); })
		.live("mouseout", function() { $(this).removeClass("active"); });
});
