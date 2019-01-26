import { NavigationActions, StackActions } from 'react-navigation';

let _navigator;

function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

function navigate(routeName, params) {
  _navigator.dispatch(
    NavigationActions.navigate({
      routeName,
      params,
    })
  );
}

reset = (routeName, params) =>{
    _navigator.dispatch(
        StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: routeName, params })],
          })
    )
}

reset_withPrevious = (routes) => {
  const actions = routes.map((val,index)=>{
    return NavigationActions.navigate({ routeName:val })
  })
  console.log(actions);
  _navigator.dispatch(
    StackActions.reset({
        index: actions.length -1,
        actions
      })
)
}

pop = () => {
    _navigator.dispatch(
        NavigationActions.back()
      );
}

// add other navigation functions that you need and export them

export default {
  navigate,
  setTopLevelNavigator,
  reset,
  reset_withPrevious,
  pop
};