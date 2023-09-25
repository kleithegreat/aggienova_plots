$(document).ready(function() {
    var selectedSupernovae = {};
    var highlightedSupernovae = [];
    var $supernovaDropdown = $('#supernova-dropdown');
    var $supernovaSearch = $('#supernova-search');
    var $selectedSupernovae = $('#selected-supernovae');
    var $plotDiv = $('#plot-div');
    var xAxisType = 'DaysSince'; 

    // Fetch all supernovae names for the dropdown
    $.getJSON('/all_supernovae', function(data) {
        data.forEach(function(supernova) {
            $supernovaDropdown.append('<option value="' + supernova + '">' + supernova + '</option>');
        });
    }).fail(function() {
        alert('Failed to load supernovae data.');
    });

    $supernovaSearch.on('keyup', function(e) {
        if (e.key === 'Enter') {
            $supernovaDropdown.val(function() {
                var searchVal = $supernovaSearch.val().toLowerCase();
                return $("#supernova-dropdown option").filter(function() {
                    return $(this).text().toLowerCase() == searchVal;
                }).val();
            });
        }
    });

    $('#add-supernova').click(function() {
        var supernova = $supernovaSearch.val() || $supernovaDropdown.val();
        if (!supernova) return;
        $.getJSON('/get_filters/' + supernova, function(data) {
            supernova = supernova.toLowerCase();
            if (selectedSupernovae[supernova]) {
                alert(supernova + " is already selected.");
                return;
            }
            var $supernovaDiv = $('<div id="' + supernova + '">');
            $supernovaDiv.append('<h2>' + supernova + ' <button class="remove-supernova">Remove</button></h2>');
            $supernovaDiv.append('<input type="checkbox" class="highlight-supernova" value="' + supernova + '"> Highlight</input><br>');
            data.forEach(function(filter) {
                var inputElem = $('<input>', {
                    type: 'checkbox',
                    id: supernova + '-' + filter,
                    name: filter,
                    checked: 'checked'
                });
                $supernovaDiv.append(inputElem).append('<label for="' + supernova + '-' + filter + '">' + filter + '</label><br>');
            });
            $selectedSupernovae.append($supernovaDiv);
            selectedSupernovae[supernova.toLowerCase()] = data;

            updatePlot();
        }).fail(function() {
            alert('Failed to load filter data for the selected supernova.');
        });
    });

    $selectedSupernovae.on('click', '.remove-supernova', function() {
        var supernova = $(this).parent().text().replace(' Remove', '');
        delete selectedSupernovae[supernova];
        $(this).parent().parent().remove();
        updatePlot();
    });

    $selectedSupernovae.on('change', '.highlight-supernova', function() {
        var supernova = $(this).val();
        if (this.checked && highlightedSupernovae.indexOf(supernova) == -1) {
            highlightedSupernovae.push(supernova);
        } else {
            var index = highlightedSupernovae.indexOf(supernova);
            if (index > -1) {
                highlightedSupernovae.splice(index, 1);
            }
        }
        updatePlot();
    });

    $selectedSupernovae.on('change', 'input[type=checkbox]', function() {
        if (!$(this).hasClass('highlight-supernova')) {
            var supernova = $(this).parent().attr('id');
            var filter = $(this).attr('name');
            if (this.checked) {
                selectedSupernovae[supernova].push(filter);
            } else {
                var index = selectedSupernovae[supernova].indexOf(filter);
                if (index > -1) {
                    selectedSupernovae[supernova].splice(index, 1);
                }
            }
        }
        updatePlot();
    });

    $('#toggle-xaxis').click(function() {
        xAxisType = (xAxisType === 'MJD') ? 'DaysSince' : 'MJD'; // Toggle between MJD and DaysSince
        updatePlot();
    });

    function updatePlot() {
        $.ajax({
            url: '/plot',
            type: 'POST',
            data: JSON.stringify({
                selectedSupernovae: selectedSupernovae,
                xAxisType: xAxisType,
                highlightedSupernovae: highlightedSupernovae
            }),
            contentType: 'application/json;charset=UTF-8',
            success: function(data) {
                $plotDiv.html(data);
            },
            error: function() {
                alert('Failed to update plot.');
            }
        });
    }
});
