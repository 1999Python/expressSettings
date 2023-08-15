import express from 'express';
import exphbs from 'express-handlebars';
import bodyParser from 'body-parser';
import SettingsBill from './functions/settingsBill.js'; // .mjs extension removed
import moment from 'moment';

const app = express();

const settingsBill = SettingsBill();

app.engine('handlebars', exphbs.engine({ layoutsDir: "./views/layouts" }));

app.set('view engine', 'handlebars');
app.set('views', './views');

app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: 'main'}))
// parse application/json
app.use(bodyParser.json())


app.get('/', function (req, res) {
    const settings = settingsBill.getSettings();
    const billTotals = settingsBill.totals();
    const hasReachedWarning = settingsBill.hasReachedWarningLevel();
    const hasReachedCritical = settingsBill.hasReachedCriticalLevel();

    res.render('index', {
        settings,
        billTotals,
        hasReachedWarning,
        hasReachedCritical
    });
});


app.post('/settings', function (req, res) {

    settingsBill.setSettings({
        callCost: Number(req.body.callCost),
        smsCost: Number(req.body.smsCost),
        warningLevel: Number(req.body.warningLevel),
        criticalLevel: Number(req.body.criticalLevel)

    });
    console.log(settingsBill.getSettings());
    res.redirect('/');

});
app.post('/action', function (req, res) {
    if (!settingsBill.hasReachedCriticalLevel()) {
        settingsBill.recordAction(req.body.actionType);
    }
    // const itemType = req.body.billItemTypeWithSettings;
    // settingsBill.recordAction(req.body.billItemTypeWithSettings);
    res.redirect('/');
});





app.get('/actions', function (req, res) {

    const action = settingsBill.actions().map(item => {
     return {
          type: item.type,
          cost: item.cost,
          timestamp: moment(item.timestamp).fromNow()}
      })
      res.render('actions', {actions: action })
    });

    app.get('/actions/:actionType', function (req, res) {
        const actionType = req.params.actionType;
        res.render('actions',  {actions: settingsBill.actionsFor(actionType)});
    });



const PORT = process.env.PORT || 3011;

app.listen(PORT, function () {
    console.log("App started at port:", PORT)
});