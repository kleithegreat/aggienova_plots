$(document).ready(function() {
    var selectedSupernovae = {};
    var highlightedSupernovae = [];
    var $supernovaDropdown = $('#supernova-dropdown');
    var $supernovaSearch = $('#supernova-search');
    var $selectedSupernovae = $('#selected-supernovae');
    var $plotDiv = $('#plot-div');
    var xAxisType = 'DaysSince';
    var yAxisType = 'Apparent'; // Added variable to track y-axis type
    var $colorPlotDiv = $('#color-plot-div');
    var selectedBands = {band1: null, band2: null}; // For storing selected bands for color calculation

    // Populate band dropdowns
    var availableBands = ['U', 'B', 'V', 'UVW1', 'UVM2', 'UVW2'];
    availableBands.forEach(function(band) {
        $('#band1-dropdown, #band2-dropdown').append('<option value="' + band + '">' + band + '</option>');
    });

    function updateColorPlot() {
        $.ajax({
            url: '/plot_colors',
            type: 'POST',
            data: JSON.stringify({
                selectedSupernovae: selectedSupernovae,
                band1: selectedBands.band1,
                band2: selectedBands.band2
            }),
            contentType: 'application/json;charset=UTF-8',
            success: function(data) {
                $colorPlotDiv.html(data);
            },
            error: function(jqXHR) {
                alert(jqXHR.responseText || 'Failed to update color plot.');
            }
        });
    }

    $('#band1-dropdown, #band2-dropdown').change(function() {
        // Update selected bands from the dropdowns
        selectedBands.band1 = $('#band1-dropdown').val();
        selectedBands.band2 = $('#band2-dropdown').val();

        if (selectedBands.band1 && selectedBands.band2) {
            // Only proceed if both bands are selected
            updateColorPlot();
        }
    });

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

    $.getJSON('/all_types', function(data) {
        data.forEach(function(type) {
            $('#type-dropdown').append('<option value="' + type + '">' + type + '</option>');
        });
    });

    $('#add-by-type').click(function() {
        var type = $('#type-dropdown').val();
        if (!type) return;
        $.getJSON('/get_supernovae_by_type/' + type, function(data) {
            data.forEach(function(supernova) {
                // Code to add each supernova to the plot (reuse the existing function/logic)
                $('#supernova-dropdown').val(supernova);
                $('#add-supernova').click();
            });
        }).fail(function() {
            alert('Failed to load supernovae data for the selected type.');
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
        $(this).text("Toggle Y-Axis (" + xAxisType + ")");
        updatePlot();
    });

    $('#toggle-yaxis').click(function() {
        yAxisType = (yAxisType === 'Apparent') ? 'Absolute' : 'Apparent';
        $(this).text("Toggle Y-Axis (" + yAxisType + ")");
        updatePlot();
    });

    $('#remove-all').click(function() {
        // Clear the selected and highlighted supernovae lists
        selectedSupernovae = {};
        highlightedSupernovae = [];
        
        // Clear the list of selected supernovae from the UI
        $('#selected-supernovae').empty();
        
        // Update the plot (which should now be empty)
        updatePlot();
    });    

    function updatePlot() {
        $.ajax({
            url: '/plot',
            type: 'POST',
            data: JSON.stringify({
                selectedSupernovae: selectedSupernovae,
                xAxisType: xAxisType,
                yAxisType: yAxisType, // Added y-axis type to the request payload
                highlightedSupernovae: highlightedSupernovae
            }),
            contentType: 'application/json;charset=UTF-8',
            success: function(data) {
                $plotDiv.html(data);
            },
            error: function(jqXHR) { // Modified error handling to display specific error messages
                alert(jqXHR.responseText || 'Failed to update plot.');
            }
        });
    }
});
