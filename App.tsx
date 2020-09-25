import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { View, Image, AsyncStorage, TouchableOpacity, Platform, Text, Dimensions } from 'react-native';
import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import _emitter from "./componentes/emitter";

const LogoFixperto = () => (<Image source={require('./assets/iconos/fixperto.png')} style={{ width: 135, height: 40 }} />);
const LogoFixperto1 = () => (<Image source={require('./assets/iconos/fixperto1.png')} style={{ width: 135, height: 40 }} />);
const Back = ({ navigation }) => (
	<TouchableOpacity onPress={() => {
		navigation.goBack();
	}}
	>
		<Ionicons name="ios-arrow-back" size={25} style={{ marginHorizontal: 15 }} color="#3D99B9" />
	</TouchableOpacity>
);
import CantFixcoin from "./componentes/cantFixcoinVista";
import Notificaciones from "./componentes/notificationsVista";
import NotificacionChat from "./componentes/notificationChatVista";
import NotificacionModal from "./componentes/notificacionModalVista";
AsyncStorage.setItem("@OFFERTRANQ", JSON.stringify({ value: true }));

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator, createMaterialTopTabNavigator } from 'react-navigation-tabs';

import Home from "./vistas/home/HomeVista";
import RegistroCliente from "./vistas/registro/cliente/registroClienteVista";
import RegistroProfesional from "./vistas/registro/experto/profesional/registroProfesionalVista";
import RegistroProfesional2 from "./vistas/registro/experto/profesional/registroProfesional2Vista";
import RegistroProfesional3 from "./vistas/registro/experto/profesional/registroProfesional3Vista";
import RegistroProfesional4 from "./vistas/registro/experto/profesional/registroProfesional4Vista";
import RegistroCompletado from "./vistas/registro/experto/registroCompletadoVista";
import RegistroEmpresa from "./vistas/registro/experto/empresa/registroEmpresaVista";
import RegistroEmpresa2 from "./vistas/registro/experto/empresa/registroEmpresa2Vista";
import RegistroEmpresa3 from "./vistas/registro/experto/empresa/registroEmpresa3Vista";
import RegistroEmpresa4 from "./vistas/registro/experto/empresa/registroEmpresa4Vista";
import Colaborador from "./vistas/colaboradores/colaboradorVista";
import Colaboradores from "./vistas/colaboradores/colaboradoresVista";
import Ventajas from "./componentes/ventajasVista";
import Ingreso from "./vistas/ingreso/ingresoVista";
import Planes from "./vistas/planes/planesVista";
import ComprarPlan from "./vistas/planes/comprarPlanVista";
import VerTransacciones from "./componentes/verTransacciones";
import OlvidoPassword from "./vistas/ingreso/olvidoPassword";
import ValidarPhone from "./componentes/validarPhone";

import Regiones from "./componentes/regionesVista";
import Direccion from "./componentes/direccionVista";

import Servicios from "./vistas/servicios/serviciosVista";
import CategoriasServicio from "./vistas/servicios/categoriasServicioVista";
import NuevaSolicitud from "./vistas/solicitudes/cliente/nuevaSolicitudVista";
import Camera from "./vistas/camera/cameraVista";
import Region from "./componentes/regionVista";
import Enviando from "./componentes/enviandoVista";
import BeneficiosFixperto from "./componentes/beneficiosFixpertoVista";
import BeneficiosCliente from "./componentes/beneficiosClienteVista";
import ProgresoDetalle from "./vistas/solicitudes/cliente/progreso/detalleProgresoSolicitudVista";
import AgendadaDetalle from "./vistas/solicitudes/cliente/agendado/agendadoSolicitudVista";
import CompletadaDetalle from "./vistas/solicitudes/cliente/completado/completadoSolicitudVista";
import Calificar from "./vistas/calificar/calificarVista";
import DatosExperto from "./vistas/datos/datosExpertoVista";
import DatosCliente from "./vistas/datos/datosClienteVista";
import ProgresosSolicitud from "./vistas/solicitudes/cliente/progreso/progresosSolicitudVista"
import AgendadosSolicitud from "./vistas/solicitudes/cliente/agendado/agendadosSolicitudVista";
import CompletadosSolicitud from "./vistas/solicitudes/cliente/completado/completadosSolicitudVista";
const SolicitudesTabNavigator = createMaterialTopTabNavigator({
	Progresos: { screen: ProgresosSolicitud, navigationOptions: ({ navigation }) => ({ title: "En progreso" }), },
	Agendados: { screen: AgendadosSolicitud },
	Completados: { screen: CompletadosSolicitud },
}, {
	tabBarOptions: {
		upperCaseLabel: false, pressColor: "#F8F8F8",
		indicatorStyle: { backgroundColor: '#42AECB', borderColor: '#42AECB', borderWidth: 0.5, },
		activeTintColor: "#63A2B4",
		inactiveTintColor: "black",
		tabStyle: { backgroundColor: "#F8F8F8" }, labelStyle: { fontFamily: "Raleway-Bold", fontSize: (Dimensions.get("screen").width >= 350) ? 14 : 12 },
	}
});

import ChatList from "./vistas/chat/chatListVista";
import Chat from "./vistas/chat/chatVista";
import VerOferta from "./vistas/oferta/verOfertaVista";
import Solicitud from "./vistas/solicitudes/cliente/solicitudVista";

import PerfilCliente from "./vistas/perfil/clienteVista";
import InformacionCliente from "./vistas/perfil/cliente/informacionVista";
import PerfilFixperto from "./vistas/perfil/perfilFixpertoVista";
import InformacionIndependiente from "./vistas/perfil/independiente/informacionVista";
import SeguridadSocialIndependiente from "./vistas/perfil/independiente/seguridadSocialVista";
import ProfesionalIndependiente from "./vistas/perfil/independiente/profesionalVista";
import CoberturaIndependiente from "./vistas/perfil/independiente/coberturaVista";
import ProyectosIndependiente from "./vistas/perfil/independiente/proyectosVista";
import ProfesionalEmpresa from "./vistas/perfil/empresa/profesionalVista";
import CoberturaEmpresa from "./vistas/perfil/empresa/coberturaVista";
import ProyectosEmpresa from "./vistas/perfil/empresa/proyectosVista";
import ColaboradoresEmpresa from "./vistas/perfil/empresa/colaboradoresVista";
import TerminosCondiciones from "./vistas/perfil/terminosCondicionesVista";
import PoliticasPrivacidad from "./vistas/perfil/politicasPrivacidadVista";
import CambiarContrasena from "./vistas/perfil/shangePassword";
import AtencionCliente from "./vistas/perfil/atencionClienteVista";
import QuienesSomos from "./vistas/perfil/quienesSomosVista";
import Configuracion from "./vistas/perfil/configuracionVista";
import ReportesTrabajos from "./vistas/perfil/reportesTrabajoVista";
import TuPlan from "./vistas/planes/tuPlanVista";
import Fixcoins from "./vistas/planes/fixcoinVista";
import ComprarFixcoin from "./vistas/planes/comprarFixcoinVista";
import PagoEpayco from "./vistas/planes/pagoEpayco";
import ReferirAmigo from "./vistas/planes/referirAmigoVista";

const BottomNavigatorCliente = createBottomTabNavigator({
	Servicios: { screen: Servicios },
	Solicitudes: {
		screen: createStackNavigator({
			SolicitudesTabNavigator: {
				screen: SolicitudesTabNavigator,
				navigationOptions: {
					header: () => (
						<View style={{ backgroundColor: "#FFFFFF" }}>
							<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, marginBottom: 10, }}>
								<Image source={require("./assets/iconos/solicit.png")} style={{ width: 25, height: 25 }} />
								<Text style={{ fontSize: 20, fontFamily: "Raleway-Bold", marginLeft: 5, color: "#273861" }}>Solicitudes</Text></View>
						</View>
					)
				}
			}
		})
	},
	Chats: {
		screen: createStackNavigator({
			ChatList: {
				screen: ChatList,
				navigationOptions: {
					header: () => (
						<View style={{ backgroundColor: "#FFFFFF" }}>
							<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, marginBottom: 10 }}>
								<Image source={require("./assets/iconos/chat_act.png")} style={{ width: 25, height: 25 }} />
								<Text style={{ fontSize: 18, fontFamily: "Raleway-Bold", marginLeft: 5, color: "#273861" }}>Chats activos</Text></View>
						</View>
					)
				}
			}
		})
	},
	Perfil: { screen: createStackNavigator({ PerfilCliente: { screen: PerfilCliente, navigationOptions: { headerShown: false } } }) }
}, {
	defaultNavigationOptions: ({ navigation }) => ({
		tabBarIcon: () => {
			const { routeName } = navigation.state;
			if (routeName === 'Servicios') {
				return (<Image source={require("./assets/iconos/servicios.png")} style={{ width: 35, height: 35, paddingTop: 15, marginTop: 30, paddingBottom: 15, marginBottom: 20, }} />)
			} else if (routeName === 'Solicitudes') {
				return (<Image source={require("./assets/iconos/solicitudes.png")} style={{ width: 35, height: 35, paddingTop: 15, marginTop: 30, paddingBottom: 15, marginBottom: 20 }} />)
			} else if (routeName === 'Chats') {
				return (
					<View style={{ flexDirection: "row", width: 35, height: 35, paddingTop: 15, marginTop: 5, paddingBottom: 15, marginBottom: 20, }}>
						<Image source={require("./assets/iconos/chat.png")} style={{ width: 35, height: 35 }} />
						<NotificacionChat _emitter={_emitter} />
					</View>)
			} else if (routeName === 'Perfil') {
				return (<Image source={require("./assets/iconos/perfil.png")} style={{ width: 35, height: 35, marginTop: 30, paddingBottom: 20, marginBottom: 20, }} />)
			}
		},
		tabBarOnPress: ({ navigation, defaultHandler }) => {
			_emitter.emit("ressetBadgeChat"); defaultHandler();
		}
	}),
	tabBarOptions: {
		inactiveBackgroundColor: "#66BBD5",
		activeBackgroundColor: "#273961",
		activeTintColor: '#FFFFFF',
		inactiveTintColor: '#FFFFFF',
		labelStyle: { fontSize: 14, fontFamily: "Raleway-Bold", marginBottom: 10 },
		style: { height: 70, }
	}
})

import FixpertoSolicitudes from "./vistas/solicitudes/fixperto/fixpertoSolicitudes";
import RealizarOferta from "./vistas/oferta/realizarOfertaVista";
import ProgresosOferta from "./vistas/oferta/progreso/progresosOfertaVista";
import ProgresoOferta from "./vistas/oferta/progreso/progresoOfertaVista";
import AgendadosOferta from "./vistas/oferta/agendado/agendadosOfertaVista";
import AgendadoOferta from "./vistas/oferta/agendado/agendadoOfertaVista";
import CompletadosOferta from "./vistas/oferta/completado/completadosOfertaVista";
import CompletadoOferta from "./vistas/oferta/completado/completadoOfertaVista";
const OfertasTabNavigator = createMaterialTopTabNavigator({
	Progresos: { screen: ProgresosOferta },
	Agendados: { screen: AgendadosOferta },
	Completados: { screen: CompletadosOferta }
}, {
	tabBarOptions: {
		upperCaseLabel: false, pressColor: "#F8F8F8",
		indicatorStyle: { backgroundColor: '#42AECB', borderColor: '#42AECB', borderWidth: 0.5 },
		activeTintColor: "#63A2B4",
		inactiveTintColor: "black",
		tabStyle: { backgroundColor: "#F8F8F8" }, labelStyle: { fontFamily: "Raleway-Bold", fontSize: (Dimensions.get("screen").width >= 350) ? 14 : 12 }
	}
});
const BottomNavigatorFixperto = createBottomTabNavigator(
	{
		Solicitudes: {
			screen: createStackNavigator({
				FixpertoSolicitudes: {
					screen: FixpertoSolicitudes,
					navigationOptions: {
						header: () => (
							<View style={{ backgroundColor: "#FFFFFF" }}>
								<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, marginBottom: 10 }}>
									<Image source={require("./assets/iconos/solicit.png")} style={{ width: 25, height: 25 }} />
									<Text style={{ fontSize: 20, fontFamily: "Raleway-Bold", marginLeft: 5, color: "#273861", }}>Solicitudes</Text></View>
							</View>
						)
					}
				}
			})
		},
		Servicios: {
			screen: createStackNavigator({
				OfertasTabNavigator: {
					screen: OfertasTabNavigator,
					navigationOptions: {
						header: () => (
							<View style={{ backgroundColor: "#FFFFFF" }}>
								<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, marginBottom: 10 }}>
									<Image source={require("./assets/iconos/solicit.png")} style={{ width: 25, height: 25 }} />
									<Text style={{ fontSize: 20, fontFamily: "Raleway-Bold", marginLeft: 5, color: "#273861", }}>Servicios</Text></View>
							</View>
						)
					}
				}
			})
		},
		Chats: {
			screen: createStackNavigator({
				ChatList: {
					screen: ChatList,
					navigationOptions: {
						header: () => (
							<View style={{ backgroundColor: "#FFFFFF" }}>
								<View style={{ flexDirection: "row", alignItems: "center", marginLeft: 10, marginTop: 20, marginBottom: 10 }}>
									<Image source={require("./assets/iconos/chat_act.png")} style={{ width: 25, height: 25 }} />
									<Text style={{ fontSize: 20, fontFamily: "Raleway-Bold", marginLeft: 5, color: "#273861", }}>Chats activos</Text></View>
							</View>
						)
					}
				}
			}),
		},
		Perfil: {
			screen: createStackNavigator({ PerfilFixperto: { screen: PerfilFixperto, navigationOptions: { headerShown: false } } })
		}
	},
	{
		defaultNavigationOptions: ({ navigation }) => ({
			tabBarIcon: () => {
				const { routeName } = navigation.state;
				if (routeName === 'Servicios') {
					return (<Image source={require("./assets/iconos/ofertas.png")} style={{ width: 35, height: 35, paddingTop: 15, marginTop: 30, paddingBottom: 15, marginBottom: 20, }} />)
				} else if (routeName === 'Solicitudes') {
					return (<Image source={require("./assets/iconos/solicitudes.png")} style={{ width: 35, height: 35, paddingTop: 15, marginTop: 30, paddingBottom: 15, marginBottom: 20, }} />)
				} else if (routeName === 'Chats') {
					return (
						<View style={{ flexDirection: "row", paddingTop: 15, marginTop: 30, paddingBottom: 15, marginBottom: 20, }}>
							<Image source={require("./assets/iconos/chat.png")} style={{ width: 35, height: 35 }} />
							<NotificacionChat _emitter={_emitter} />
						</View>)
				} else if (routeName === 'Perfil') {
					return (<Image source={require("./assets/iconos/perfil.png")} style={{ width: 35, height: 35, marginTop: 30, paddingBottom: 20, marginBottom: 20, }} />)
				}
			},
			tabBarOnPress: ({ navigation, defaultHandler }) => {
				_emitter.emit("ressetBadgeChat"); defaultHandler();
			}
		}),
		tabBarOptions: {
			inactiveBackgroundColor: "#66BBD5",
			activeBackgroundColor: "#273961",
			activeTintColor: '#FFFFFF',
			inactiveTintColor: '#FFFFFF',
			labelStyle: { fontSize: 14, fontFamily: "Raleway-Bold", marginBottom: 10 },
			style: { height: 70, },
		}
	}
)

const RootNavigator = createStackNavigator({
	Home: {
		screen: Home,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#273861" },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroCliente: {
		screen: RegistroCliente,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	InformacionCliente: {
		screen: InformacionCliente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Información personal",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	RegistroProfesional: {
		screen: RegistroProfesional,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroProfesional2: {
		screen: RegistroProfesional2,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroProfesional3: {
		screen: RegistroProfesional3,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroProfesional4: {
		screen: RegistroProfesional4,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	InformacionIndependiente: {
		screen: InformacionIndependiente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Información personal",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	SeguridadSocialIndependiente: {
		screen: SeguridadSocialIndependiente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Seguridad social",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ProfesionalIndependiente: {
		screen: ProfesionalIndependiente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Perfil profesional",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	CoberturaIndependiente: {
		screen: CoberturaIndependiente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Cobertura",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ProyectosIndependiente: {
		screen: ProyectosIndependiente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Proyectos",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ProfesionalEmpresa: {
		screen: ProfesionalEmpresa,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Perfil empresarial",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	CoberturaEmpresa: {
		screen: CoberturaEmpresa,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Cobertura",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ProyectosEmpresa: {
		screen: ProyectosEmpresa,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Proyectos",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ColaboradoresEmpresa: {
		screen: ColaboradoresEmpresa,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Colaboradores",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	CambiarContrasena: {
		screen: CambiarContrasena,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Cambiar contraseña",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	TerminosCondiciones: {
		screen: TerminosCondiciones,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Términos y condiciones",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	PoliticasPrivacidad: {
		screen: PoliticasPrivacidad,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Política y privacidad",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	AtencionCliente: {
		screen: AtencionCliente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Atención al cliente",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	QuienesSomos: {
		screen: QuienesSomos,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Quiénes somos",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	TuPlan: {
		screen: TuPlan,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Tu plan",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Planes: {
		screen: Planes,
		navigationOptions: ({ navigation }) => ({
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	ComprarPlan: {
		screen: ComprarPlan,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Comprar plan",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	VerTransacciones: {
		screen: VerTransacciones,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Transacciones",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Fixcoins: {
		screen: Fixcoins,
		navigationOptions: ({ navigation }) => {
			return {
				title: "fixcoin",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ComprarFixcoin: {
		screen: ComprarFixcoin,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Comprar fixcoin",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	PagoEpayco: {
		screen: PagoEpayco,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Epayco",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ReferirAmigo: {
		screen: ReferirAmigo,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Referir un amigo",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Configuracion: {
		screen: Configuracion,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Configuración",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ReportesTrabajos: {
		screen: ReportesTrabajos,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Reportes de trabajos",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	RegistroCompletado: {
		screen: RegistroCompletado,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroEmpresa: {
		screen: RegistroEmpresa,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroEmpresa2: {
		screen: RegistroEmpresa2,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroEmpresa3: {
		screen: RegistroEmpresa3,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	RegistroEmpresa4: {
		screen: RegistroEmpresa4,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	Colaborador: {
		screen: Colaborador,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0 },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	Colaboradores: {
		screen: Colaboradores,
		navigationOptions: {
			headerTitle: "fixperto",
			headerTitleAlign: "center",
		}
	},
	Ventajas: {
		screen: Ventajas,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto />),
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#273861" },
			headerTitleAlign: "center",
			headerLeft: () => (
				<Ionicons name="ios-arrow-back" size={20} style={{ padding: 10 }} color="#3D99B9"
					onPress={() => { navigation.goBack() }} />)
		})
	},
	OlvidoPassword: {
		screen: OlvidoPassword,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#273861" },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	ProgresoOferta: {
		screen: ProgresoOferta,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Servicio",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	AgendadoOferta: {
		screen: AgendadoOferta,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Servicio agendado",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	CompletadoOferta: {
		screen: CompletadoOferta,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Servicio finalizado",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	BottomNavigatorCliente: {
		screen: BottomNavigatorCliente,
		navigationOptions: ({ navigation }) => {
			return {
				headerTitle: () => (<LogoFixperto1 />),
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0 },
				headerLeft: () => (<Notificaciones navigation={navigation} />),
				headerRight: () => null
			}
		}
	},
	BottomNavigatorFixperto: {
		screen: BottomNavigatorFixperto,
		navigationOptions: ({ navigation }) => {
			return {
				headerTitle: () => (<LogoFixperto1 />),
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0 },
				headerLeft: () => (<Notificaciones navigation={navigation} />),
				headerRight: () => (<CantFixcoin navigation={navigation} />)
			}
		}
	},
	CategoriasServicio: {
		screen: CategoriasServicio,
		navigationOptions: ({ navigation }) => {
			return {
				title: navigation.getParam('service').denomination,
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerTitleStyle: {},
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	NuevaSolicitud: {
		screen: NuevaSolicitud,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Nueva solicitud",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Enviando: {
		screen: Enviando,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerStyle: { borderBottomWidth: 0 },
			headerTitleAlign: "center",
			headerLeft: () => null
		})
	},
	BeneficiosFixperto: {
		screen: BeneficiosFixperto,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#273861" },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	BeneficiosCliente: {
		screen: BeneficiosCliente,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#273861" },
			headerLeft: () => (<Back navigation={navigation} />)
		})
	},
	ProgresoDetalle: {
		screen: ProgresoDetalle,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Solicitud",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	AgendadaDetalle: {
		screen: AgendadaDetalle,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Solicitud",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	CompletadaDetalle: {
		screen: CompletadaDetalle,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Solicitud",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Chat: {
		screen: Chat,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Chat",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	VerOferta: {
		screen: VerOferta,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Servicio",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Direccion: {
		screen: Direccion,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Dirección",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => null
			};
		}
	},
	RealizarOferta: {
		screen: RealizarOferta,
		navigationOptions: ({ navigation }) => {
			return {
				title: (navigation["state"]["params"]["action"] === "add") ? "Aplicar al servicio" : (navigation["state"]["params"]["action"] === "mod") ? "Editar servicio" : "Ver servicio",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Calificar: {
		screen: Calificar,
		navigationOptions: ({ navigation }) => {
			return {
				title: (navigation["state"]["params"]["type"] === "experto") ? "Calificar cliente" : "Calificar experto",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Camera: {
		screen: Camera,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Cámara",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Region: {
		screen: Region,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Ciudad",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	Regiones,
	Solicitud: {
		screen: Solicitud,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Solicitud",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	DatosExperto: {
		screen: DatosExperto,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Perfil fixperto",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	DatosCliente: {
		screen: DatosCliente,
		navigationOptions: ({ navigation }) => {
			return {
				title: "Perfil cliente",
				headerTitleAlign: "center",
				headerStyle: { borderBottomWidth: 0, backgroundColor: "#DDDDDD" },
				headerLeft: () => (<Back navigation={navigation} />)
			};
		}
	},
	ValidarPhone: {
		screen: ValidarPhone,
		navigationOptions: ({ navigation }) => ({
			headerTitle: () => (<LogoFixperto1 />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#fff" },
			headerLeft: () => (null)
		})
	},
	Ingreso: {
		screen: Ingreso,
		navigationOptions: {
			headerLeft: () => null,
			headerTitle: () => (<LogoFixperto />),
			headerTitleAlign: "center",
			headerStyle: { borderBottomWidth: 0, backgroundColor: "#273861" }
		}
	}
}, {
	initialRouteName: "Ingreso",
	initialRouteParams: { _emitter }
});
const AppContainer = createAppContainer(RootNavigator);
import * as Font from 'expo-font';
import { setCustomText } from 'react-native-global-props';
import * as FileSystem from 'expo-file-system';
export default class App extends React.Component {
	state = { expoPushToken: '', notification: {}, showNotification: false };
	registerForPushNotificationsAsync = async () => {
		if (Constants.isDevice) {
			const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
			let finalStatus = existingStatus;
			if (existingStatus !== 'granted') { const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS); finalStatus = status; }
			if (finalStatus !== 'granted') { alert('Error al obtener el token para la notificación push!'); return; }
			let token = await Notifications.getExpoPushTokenAsync();
			AsyncStorage.setItem("token", JSON.stringify(token));
			this.setState({ expoPushToken: token });
		} else { alert('Debe usar un dispositivo físico para notificaciones push'); }
		if (Platform.OS === 'android') {
			Notifications.createChannelAndroidAsync('fixperto', {
				name: 'Notificaciones fixperto',
				sound: true,
				priority: 'max',
				vibrate: [0, 250, 250, 250],
			});
		}
	};
	async componentDidMount() {
		this.registerForPushNotificationsAsync();
		Notifications.addListener(this._handleNotification);
		await Font.loadAsync({
			'Raleway-Regular': require('./assets/fonts/Raleway-Regular.ttf'),
			'Raleway-Bold': require('./assets/fonts/Raleway-Bold.ttf'),
			'Raleway-Italic': require('./assets/fonts/Raleway-Italic.ttf')
		});
		this.defaultFonts();
	}
	defaultFonts() {
		const customTextProps = { style: { fontFamily: 'Raleway-Regular' } }
		setCustomText(customTextProps);
	}
	_handleNotification = notification => {
		FileSystem.readAsStringAsync(FileSystem.documentDirectory + '/config.json').then((contenido) => {
			contenido = JSON.parse(contenido);
			var notifications = contenido["notifications"];
			if (notification["data"]["compra"]) {
				AsyncStorage.getItem("@USER").then((user) => {
					user = JSON.parse(user);
					let fixcoin = 0;
					let compra = notification["data"]["compra"];
					if (compra["tipo"] === "plan") {
						fixcoin = user["cant_fitcoints"] + compra["fitcoints"];
						user["cant_fitcoints"] = fixcoin;
						user["planId"] = compra["id_plan"];
						user["planPrice"] = compra["price"];
						user["planUri"] = compra["uri"];
						user["planEnd"] = compra["planEnd"];
						user["planStatus"] = "active";
					} else if (compra["tipo"] === "fixcoin") {
						fixcoin = user["cant_fitcoints"] + compra["cant"];
						user["cant_fitcoints"] = fixcoin;
					}
					AsyncStorage.setItem("@USER", JSON.stringify(user));
					FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: true, registered: true, validate_number: true, vista: "BottomNavigatorFixperto", user, notifications }))
					this.setState({ notification, showNotification: true });
				})
			}
			else if (notification["data"]["datos"] && notification["data"]["datos"]["type"] === "add_fixcoin") {
				AsyncStorage.getItem("@USER").then((user) => {
					user = JSON.parse(user);
					let datos = notification["data"]["datos"];
					user["cant_fitcoints"] = user["cant_fitcoints"] + parseInt(datos["cantidad"]);
					AsyncStorage.setItem("@USER", JSON.stringify(user));
					FileSystem.writeAsStringAsync(FileSystem.documentDirectory + '/config.json', JSON.stringify({ logged: true, registered: true, validate_number: true, vista: "BottomNavigatorFixperto", user, notifications }))
					this.setState({ notification, showNotification: true });
				})
			}
			else if (notification["data"]) {
				this.setState({ notification, showNotification: true });
			}
		})
	};
	navigation = null;
	render() {
		const { showNotification, notification } = this.state;
		return (<View style={{ flex: 1 }}>
			<NotificacionModal navigation={this.navigation} show={showNotification} notification={notification} closeModal={() => { this.setState({ showNotification: false }) }} />
			<AppContainer ref={nav => { this.navigation = nav; }} />
		</View>);
	}
}
