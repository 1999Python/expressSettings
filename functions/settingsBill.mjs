import monent from "moment";

export default function SettingsBill() {
    

    let smsCost;
    let callCost;
    let warningLevel;
    let criticalLevel; 

    let actionList = [];

    function setSettings (settings) {
        smsCost = Number(settings.smsCost);
        callCost = Number(settings.callCost);
        warningLevel = Number(settings.warningLevel);
        criticalLevel = Number(settings.criticalLevel);
    }

    function getSettings
    () {
        return {
            smsCost,
            callCost,
            warningLevel,
            criticalLevel
        }
    }

    function recordAction(action) {

        let cost = 0;
        if (action === 'sms'){
            cost = smsCost;
        }
        else if (action === 'call'){
            cost = callCost;
        }

        actionList.push({
            type: action,
            cost : cost,
            timestamp: new Date()
        });
    }

    function callAction(action, callInput, smsInput) {
        if (action === "call") {
          useCall();
          cost = callInput;
        } else if (action === "sms") {
          useSms();
          cost = smsInput;
        }
    
        if (cost > 0) {
          actionList.push({
            type: action,
            cost: cost.toFixed(2),
            timestamp: moment(),
          });
        }
      }

    function actions(){
        return actionList;
    }

    function actionsFor(type){
        const filteredActions = [];

        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // add the action to the list
                filteredActions.push(action);
            }
        }

        return filteredActions;

        // return actionList.filter((action) => action.type === type);
    }

    function getTotal(type) {
        let total = 0;
        // loop through all the entries in the action list 
        for (let index = 0; index < actionList.length; index++) {
            const action = actionList[index];
            // check this is the type we are doing the total for 
            if (action.type === type) {
                // if it is add the total to the list
                total += action.cost;
            }
        }
        return total;
    }

    function grandTotal() {   
        return (Number(getTotal('sms')) + Number(getTotal('call'))).toFixed(2);
    }

    function totals() {
        let smsTotal = getTotal('sms');
        let callTotal = getTotal('call');

    
        let grandTotalClass = grandTotal >= criticalLevel ? 'danger' : (grandTotal >= warningLevel ? 'warning' : '');
    
        return {
            smsTotal,
            callTotal,
            grandTotal: grandTotal(),
            grandTotalClass
        };
    }

    function hasReachedWarningLevel(){
        const total = grandTotal();
        const reachedWarningLevel = total >= warningLevel 
            && total < criticalLevel;

        return reachedWarningLevel;
    }

    function hasReachedCriticalLevel(){
        const total = grandTotal();
        return total >= criticalLevel;
    }

    return {
        setSettings,
        getSettings,
        recordAction,
        actions,
        callAction,
        actionsFor,
        totals,
        hasReachedWarningLevel,
        hasReachedCriticalLevel
    }
}



