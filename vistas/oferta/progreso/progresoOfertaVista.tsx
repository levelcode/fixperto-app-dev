import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Detalle from "./detalleProgresoOfertaVista";
export default createMaterialTopTabNavigator({
	Detalle: { screen: Detalle }
}, {
	tabBarOptions: {
		indicatorStyle: { backgroundColor: 'red' },
		activeTintColor: "#63A2B4",
		inactiveTintColor: "black",
		tabStyle: { backgroundColor: "#F8F8F8" }
	}
});