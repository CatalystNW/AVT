// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Node Modules
// Import and Node Modules (from package.json) that the app will use)
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var express = require('express');
var favicon = require('serve-favicon');
var db = require('./mongoose/connection');
var request = require('request');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var fs = require('fs');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var session = require('express-session');
var ProjectPlanPackage = require('./models/projectPlanPackage.js');

var app = express();

//configure passport
app.use(session({ secret: 'hidethissomewhere', resave: true, saveUninitialized: true}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var initPassport = require('./passport/init');
initPassport(passport);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Route Naming and Importing
// Define routes that will be used
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
var routes = require('./routes/index')(passport);
var report = require('./routes/report')(passport);
//var test = require('./routes/test');
var view = require('./routes/view')(passport);
var edit = require('./routes/edit')(passport);
var tasks = require('./routes/tasks.js')(passport);
var leadtime = require('./routes/leadtime.js')(passport);
var appform = require('./routes/appform')(passport);
var vettingworksheet = require('./routes/vettingworksheet')(passport);
var regUser = require('./routes/regUser')(passport);
var site = require('./routes/site')(passport);
var planning = require('./routes/planning')(passport);
var projectsummary = require('./routes/projectsummary')(passport);
var partners = require('./routes/partners')(passport);
var projectview = require('./routes/projectview')(passport);

var care_network = require('./carenetwork/routes/care/carenetwork');


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Init the Express App Engine
// Start Express and serve the favicon
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

app.use(favicon(__dirname + '/public/images/favicon.ico'));

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// View Engine
// Setup view engine relative path, register partials, and declare Handlebars as the
// view engine to generate HTML for the client
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(__dirname + '/views/partials');
app.set('view engine', 'hbs');
app.set('view options', { layout: 'layout' });

// hbs.registerPartial('partnerTab', path.join(__dirname,'views/partners.hbs'));

hbs.registerHelper("debug", function(optionalValue) {
    console.log("Current Context");
    console.log("====================");
    console.log(this);

    if (optionalValue) {
        console.log("Value");
        console.log("====================");
        console.log(optionalValue);
    }
});

hbs.registerHelper('stringify', function(val) {
  if (!val) { return '' }
  return JSON.stringify(val, null, '  ')
})

hbs.registerHelper('returnObject', function(val) {
  return val
})

hbs.registerHelper('if_eq', function(a, b, opts) {
    if (a == b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});

hbs.registerHelper('if_not_eq', function(a, b, opts) {
    if (a !== b) {
        return opts.fn(this);
    } else {
        return opts.inverse(this);
    }
});


hbs.registerHelper('if_in', function(list, elm, opts) {
  if(list === undefined)
    return opts.inverse(this);  
  if (list.indexOf(elm) > -1) {
      return opts.fn(this);
  } else {
    return opts.inverse(this);
  }
})

hbs.registerHelper('googleMapAddr', function(addr) {
  var addrText = ''
  addrText += addr.line_1 + ','
  if (addrText.line_2) { addrText += addr.line_2 + ','}
  addrText += addr.city + ','
  addrText += addr.state + ' '
  addrText += addr.zip

  return addrText.replace(' ', '+')
})

hbs.registerHelper('escape', function(variable) {
  if (variable) {

    return new hbs.handlebars.SafeString(variable.toString().replace(/(['"\n\r])/g, '\\$1'));
  } else return '';
  
});

hbs.registerHelper('add_d_quote', function(variable) {
    if (variable) {

      return new hbs.handlebars.SafeString(variable.toString().replace(/(["])/g, '""'));
    } else return '';

});

hbs.registerHelper('assetsValueAndName', function(assets) {
  var returnText = ''
  assets.value.forEach(function(v, i) {
    if (assets.name[i]) {
      if (i !== 0) returnText += ', '
      returnText += assets.name[i] + ' ($' + v + ')'
    }
  })

  return returnText
})

hbs.registerHelper('ageAndBirthday', function(birthday) {
  var returnText = ''

  var d = birthday.getTime()
  var today = new Date().getTime()

  if (isNaN(d) || isNaN(today)) { debugger; return 'n/a' }
  else {
    var diff = today - d
    var age = Math.floor(diff / (1000*60*60*24*365.25))
    return age.toString() + ' years old'
  }
})

hbs.registerHelper('otherResidents', function(residentsObject) {

  if (residentsObject.name[0] == '') { return 'None' }
  else {
    var returnText = ''
    residentsObject.name.forEach(function(r, idx) {
      if (r !== '') {
        returnText += (
          r + ' (' + residentsObject.age[idx] + '), '
          + residentsObject.relationship[idx] + ';'
        )
      }
    })

    return returnText
  }
})

hbs.registerHelper('select', function(values) {
  console.log('here');
  console.log(values);
  var $el = $('select');
  console.log($el);
  var i = 0;
  for(i; i<values.length; i++)
  {
    $el.find('[value="' + values[i] + '"]').attr({'selected': 'selected'});
  }
  return $el.html();
})

hbs.registerHelper('getCompletedDate', function (item, name) {
  return item.getCompletedDate(name);
})

hbs.registerHelper('convertStatus', function(statusKey) {
  switch (statusKey){
    case 'assess':
        return 'Site Assessment - Pending';
        break;
    case 'assessComp':
        return 'Site Assessment - Complete';
        break;
    case 'approval':
        return 'Approval Process';  
    case 'waitlist':
        return 'Waitlist';
    case 'upComing':
        return'Project Upcoming'; 
    case 'handle':
        return "Handle-It";
    default:
        return "Error"
  }
})

hbs.registerHelper('plus_one', function(idx){
  return idx + 1
})

hbs.registerHelper('getAppNameForPlan', function(apps, appid) {
  if (apps[appid] && apps[appid].app_name) {
    return apps[appid].app_name
  } 
  // else {
  //   return "---";
  // }

});
hbs.registerHelper('getPlanLeadTime', function(plan) {
  return 'todo: put lead time here'
});
hbs.registerHelper('getApplicationStartTime', function (apps, appid) {
  if (apps[appid] && apps[appid].project && apps[appid].project.project_start) {
    return new Date(apps[appid].project.project_start).toLocaleDateString();
  } else {
    return 'Not set'
  }
});

hbs.registerHelper('getApplicationDueDate', function (apps, appid, ldTime) {
  console.log("Handlebars Helper: getApplicationDueDate called");
  console.log(ldTime);
  if (apps[appid] && apps[appid].project && apps[appid].project.project_start) {
      var myNewDate = new Date(apps[appid].project.project_start);
      
      myNewDate.setDate(myNewDate.getDate() - parseInt(20));

      return myNewDate.toLocaleDateString();
  } else {
      return 'Not set'
  }
});

hbs.registerHelper('dateToLocaleDate', function (date) {
  //console.log('dateToLocaleDate', arguments);
  
  if (date === "Not set") {
    return 'Not set'
  } else {
      var d = new Date(date)
      var month = (d.getMonth() + 1).toString();
      if (month.length !== 2) {
        month = '0' + month;
      }
      var day = d.getDate().toString()
      if (day.length !== 2) {
        day = '0' + day;
      }
      return + d.getFullYear() + '-' + month + '-' + day 
  }

});

hbs.registerHelper('fillFields', function(field){
    if(field){
        return field
    }
    else{
        return 'N/A'
    }
})

hbs.registerHelper('getPlanTaskAssignments', function(plan, userId, apps, appid) {
  var assigned = ProjectPlanPackage.getOnlyAssigned(plan, userId);
  var labels = [];
  for (var i = 0; i < assigned.length; i++) {
    if (!assigned[i].complete) {
      console.log("apple");
      console.log(assigned[i]);
      labels.push(assigned[i].label);
    }
  }
  return new hbs.handlebars.SafeString(labels.join("<br/>"))
});


hbs.registerHelper('getPlanTop3Tasks', function(plan, apps, appid, assignableUsers) {  
  var open = ProjectPlanPackage.getTopXOpen(plan, 3);
  var labels = [];
  for (var i = 0; i < open.length; i++) {
    if (!open[i].complete) {    
      var user;
      var userName = "";
      if(open[i].owner !== null)
      {
      
        user =  assignableUsers.find(function(x){
        
          return x._id.toString() === open[i].owner.toString();});
        
          userName = user.contact_info.user_name.user_first + " " + user.contact_info.user_name.user_last;
      
          labels.push(open[i].label + " - " + userName); 
      }  
      else{
        labels.push(open[i].label); 
      }    
    
    }
  }
  return new hbs.handlebars.SafeString(labels.join("<br/>"))
});

hbs.registerHelper('getPreferredName', function(apps, appid) {
  if (apps[appid] && apps[appid].application && apps[appid].application.name) {
    return (apps[appid].application.name.preferred || apps[appid].application.name.first) +
           ' ' + apps[appid].application.name.last
  } else {
    return '';
  }
});


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Middleware
// Use any middleware for the application that is needed. bodyParse allows parsing to
// and from JSON, cookieParser allows reading and writing cookies, set path to relative
// directory on server
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(morgan('dev'));


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Middleware the will -ALWAYS- be executed
// This method logs the HTTP Request type and the IPv6 of the user
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use(function(req, res, next) {
    // var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    console.log('[ ' + req.method + ' ] request made from ' + 'IP: ' + ip);
    if(req.get('X-Forwarded-Proto') == 'http'){
      res.redirect('https://' + req.get('Host') + req.url);
    }
	else
    next();
});


// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Assign URI to Routes
// Use routes now that app has been initiated and all middleware is defined
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use('/', routes);
app.use('/view', view);
app.use('/edit', edit);
app.use('/application', appform);
app.use('/vettingworksheet', vettingworksheet);

app.use('/user', regUser);

app.use('/site', site);
app.use('/pm', planning);

app.use('/projectsummary', projectsummary);
app.use('/partners', partners);
app.use('/projectview', projectview);
app.use('/tasks/', tasks);
app.use('/leadtime', leadtime);
app.use('/carenetwork', care_network);
app.use('/projectreport', report);
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Server Side Libraries
// Links to jQuery and Boots strap files
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js'));
app.use('/js', express.static(__dirname + '/node_modules/jquery/dist'));
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css'));
app.use('/javascript', express.static(__dirname + '/public/javascripts'));
app.use('/fonts/', express.static(__dirname + '/node_modules/bootstrap/dist/fonts'));



// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// Error handlers
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// 4XX Code
// 400 - Bad request
app.use(function(req, res, next) {
    var err = new Error('Bad request');
    err.status = 400;
    next(err);
});

// 401 - Unauthorized
app.use(function(req, res, next) {
    var err = new Error('Unauthorized');
    err.status = 401;
    next(err);
});

// 404 - Not found
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// development error handler, will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler, no stacktrace leaked to user
app.use(function(err, req, res, next) {
    res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;
