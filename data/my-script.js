// Main content script.
console.error("rolll");
// Get path and move it from page->content->main script.
window.addEventListener('message', function(event) {
self.port.emit("my-addon-message",  event.data);
}, false);

// Get options from add-on settings.
var options = self.options;
console.log(options);
// Lookup legend to find entity by one of its properties.
var entitiesFinder = {
  "user" : "roles",
  "node" : "nid",
  "taxonomyTerm" : "tid",
  "form" : "form_id",
  "formState" : "form state",
  "product" : "product_id",
  "lineItem" : "line_item_id"
};
 $('.krumo-element:not(".processed")').addClass('processed').append('<span class="krumo-get-path"><a href="#">Get path</a></span>');


// The function to return the path.
$('.krumo-get-path').click( function() {
  // Function for getting a path to an element in PHP.
  var pathItems = [];
  var firstElement = "$vars";
  var parent = $(this).parents('.krumo-root');
     for (var key in options) {
     if ($('.krumo-root  a:contains("' + entitiesFinder[key] + '")').length) {

     firstElement = options[key];
     }
     }
  if ($('.krumo-root  a:contains("roles")').length) {
  firstElement = "$user";
  }
  if ($('.krumo-root  a:contains("tid")').length) {
  firstElement = "$term";
  }
  if ($('.krumo-root  a:contains("nid")').length) {
  firstElement = "$node";
  }
  if ($('.krumo-root  a:contains("product_id")').length) {
    firstElement = "$product";
  }
  if ($('.krumo-root  a:contains("nid")').length) {
    firstElement = "$node";
  }

  //var krumoIndex = parent.index('.krumo-root');
  // Array which will hold all the pieces of the trail.
  var currentItem = ['Trail', $(this).parent().children('.krumo-name').text()];
  pathItems.push(currentItem);

  // Filling the trail array.
  $(this).parents('.krumo-nest').each(function(i) {
      // Get the element type.
      var elementType = $(this).prev('.krumo-element').children('.krumo-type').text().toString().split(' ');
      // Objects.
      if (elementType[0] == 'Object') {
      var currentItem = ['Object', $(this).prev('.krumo-element').children('.krumo-name').text()];
      }
      // Arrays.
      else if (elementType[0] == 'Array,') {
      var currentItem = ['Array', $(this).prev('.krumo-element').children('.krumo-name').text()];
      }
      pathItems.push(currentItem);
      });

  // The string with the whole trail which will be returned at the end.
  var trail = '';
  // For each item in the trail array we are going to add it to the trail.
  $.each(pathItems, function(i) {
      // Fix the trail for arrays.
      if (pathItems[i +1] && pathItems[i +1][0] == 'Array') {
      // Integers should be returned as integers.
      if (parseInt($(this)[1]) == $(this)[1]) {
      trail = '[' + $(this)[1] + ']' + trail;
      }
      // Replace 'und' by the Drupal constant LANGUAGE_NONE.
      else if ($(this)[1] == 'und') {
      trail = '[LANGUAGE_NONE]' + trail;
      }
      // Else we return the item as a string in the trail.
      else {
      trail = "['" + $(this)[1] + "']" + trail;
      }
      }
      // Fix the trail for objects.
      else if (pathItems[i +1] && pathItems[i +1][0] == 'Object') {
      // Replace 'und' by the Drupal constant LANGUAGE_NONE.
      if ($(this)[1] == 'und') {
      trail = '->{LANGUAGE_NONE}' + trail;
      }
      // Else we add the item to the trail.
      else {
        trail = '->' + $(this)[1] + trail;
      }
      }
      else {
        // Add the variable name if it could be found.
        trail = firstElement + trail;
      }
  });
  $(this).addClass('hidden').hide().before('<input id="trail-input" value="' + trail + '" />');
  window.postMessage(trail, "*");
  $('#trail-input').select().blur(function() {
      $(this).remove();
      $('.krumo-get-path.hidden').show();
      });

  return false;
});
 /*


// The function to return the path.
$('.krumo-get-path').click( function() {
  // Function for getting a path to an element in PHP.
  var pathItems = [];
  var firstElement = "$vars";
  var parent = $(this).parents('.krumo-root');
     for (var key in options) {
     if ($('.krumo-root  a:contains("' + entitiesFinder[key] + '")').length) {

     firstElement = options[key];
     }
     }
  if ($('.krumo-root  a:contains("roles")').length) {
  firstElement = "$user";
  }
  if ($('.krumo-root  a:contains("tid")').length) {
  firstElement = "$term";
  }
  if ($('.krumo-root  a:contains("nid")').length) {
  firstElement = "$node";
  }
  if ($('.krumo-root  a:contains("product_id")').length) {
    firstElement = "$product";
  }
  if ($('.krumo-root  a:contains("nid")').length) {
    firstElement = "$node";
  }

  //var krumoIndex = parent.index('.krumo-root');
  // Array which will hold all the pieces of the trail.
  var currentItem = ['Trail', $(this).parent().children('.krumo-name').text()];
  pathItems.push(currentItem);

  // Filling the trail array.
  $(this).parents('.krumo-nest').each(function(i) {
      // Get the element type.
      var elementType = $(this).prev('.krumo-element').children('.krumo-type').text().toString().split(' ');
      // Objects.
      if (elementType[0] == 'Object') {
      var currentItem = ['Object', $(this).prev('.krumo-element').children('.krumo-name').text()];
      }
      // Arrays.
      else if (elementType[0] == 'Array,') {
      var currentItem = ['Array', $(this).prev('.krumo-element').children('.krumo-name').text()];
      }
      pathItems.push(currentItem);
      });

  // The string with the whole trail which will be returned at the end.
  var trail = '';
  // For each item in the trail array we are going to add it to the trail.
  $.each(pathItems, function(i) {
      // Fix the trail for arrays.
      if (pathItems[i +1] && pathItems[i +1][0] == 'Array') {
      // Integers should be returned as integers.
      if (parseInt($(this)[1]) == $(this)[1]) {
      trail = '[' + $(this)[1] + ']' + trail;
      }
      // Replace 'und' by the Drupal constant LANGUAGE_NONE.
      else if ($(this)[1] == 'und') {
      trail = '[LANGUAGE_NONE]' + trail;
      }
      // Else we return the item as a string in the trail.
      else {
      trail = "['" + $(this)[1] + "']" + trail;
      }
      }
      // Fix the trail for objects.
      else if (pathItems[i +1] && pathItems[i +1][0] == 'Object') {
      // Replace 'und' by the Drupal constant LANGUAGE_NONE.
      if ($(this)[1] == 'und') {
      trail = '->{LANGUAGE_NONE}' + trail;
      }
      // Else we add the item to the trail.
      else {
        trail = '->' + $(this)[1] + trail;
      }
      }
      else {
        // Add the variable name if it could be found.
        trail = firstElement + trail;
      }
  });
  $(this).addClass('hidden').hide().before('<input id="trail-input" value="' + trail + '" />');
  window.postMessage(trail, "*");
  $('#trail-input').select().blur(function() {
      $(this).remove();
      $('.krumo-get-path.hidden').show();
      });

  return false;
});

    // Explain link in query log

    // Define krumo root.
    var k = $('.krumo-root:not(".processed")');

    // Check if there is a krumo.
    if ($(k).addClass('processed').length > 0) {
      var form  = '<div class="search-krumo">';
      form     += '  <form id="search-krumo">';
      form     += '    <input type="text" name="search-query" class="form-text"/>';
      // If there are more than one krumo's.
      if ($(k).length > 1) {
        form   += '    <select name="search-option">';
        form   += '      <option value="all">search all</option>';
        // For each krumo.
        $(k).each(function(i) {
          i++;
          form += '      <option value="'+ i +'">search krumo #'+ i +'</option>';
        });
        form   += '    </select>';
      }
      form     += '    <input type="submit" value="submit" name="submit" class="form-submit" />';
      form     += '  </form>';
      form     += '</div>';
      form     += '<div class="search-krumo-results"></div>';

      // Insert the form before the first krumo.
      k.eq(0).before(form);
    }

    // On submit execute the following.
    $('form#search-krumo').submit(function() {
      // Remove result and classes from previous query.
      $('.krumo-element.krumo-query-result').removeClass('krumo-query-result');
      $('.krumo-nest').hide().prev().removeClass('krumo-opened');
      $('.search-krumo-results').html('');

      // Get query value and option value as variables.
      var q = $('input[name=search-query]', this).val();
      var o = $('select[name=search-option]', this).val();
      // If the query is not empty, we can proceed.
      if (q) {
        var k;
        if (o && o != 'all') {
          k = $('.messages.status ul li:nth-child('+ o +') .krumo-root');
        }
        else {
          k = $('.krumo-root');
        }
        // Find all elements with the query.
        $('.krumo-element > a:contains('+ q +'), .krumo-element > strong:contains('+ q +')', k).each(function(i) {
          // Add result class.
          $(this).parent().addClass('krumo-query-result');

          // Expand parents until the query result is layed open before the user.
          $(this).parent().parents(".krumo-nest").show().prev().addClass('krumo-opened');
        });
        // Show result overview.
        $('.search-krumo-results').html('Found '+ $('.krumo-element > a:contains('+ q +'), .krumo-element > strong:contains('+ q +')', k).length +' elements');
      }
      else {
        $('.search-krumo-results').html('Empty query');
      }
      return false;
    });

*/
