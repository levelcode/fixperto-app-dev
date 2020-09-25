import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Detalle from "./detalleAgendadoSolicitudVista";
import Status from "./statusAgendadoSolicitudVista";

export default createMaterialTopTabNavigator({
	Detalle: { screen: Detalle }, Status: { screen: Status, navigationOptions: ({ navigation }) => ({ title: "Estado" }),  }
}, {
	tabBarOptions: {
		indicatorStyle: { backgroundColor: 'red' },
		activeTintColor: "#63A2B4",
		inactiveTintColor: "black",
		tabStyle: { backgroundColor: "#F8F8F8" }
	}
});