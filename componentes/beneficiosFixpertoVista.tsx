import React, { Component } from 'react';
import { Text, ScrollView, View, Dimensions, ImageBackground, Image } from 'react-native';
import { Button, Icon } from 'react-native-elements';
import { Ionicons } from '@expo/vector-icons';
import Modal from "react-native-modal";
import { Video } from 'expo-av';
import { buttons } from "../style/style";
import { url } from "./config";
export default class BeneficiosFixpertoVista extends Component {
	constructor(props) { super(props); this.state = { mute: false, shouldPlay: true, isModalVisible: false } }
	handlePlayAndPause = () => { this.setState((prevState) => ({ shouldPlay: !prevState["shouldPlay"], })); }
	handleVolume = () => { this.setState(prevState => ({ mute: !prevState["mute"] })); }
	iniciarRegistro = () => {
		this.props["navigation"].navigate((this.props["navigation"].getParam("type") === "profesional" ? "RegistroProfesional" : "RegistroEmpresa"))
	}
	toggleModal = () => { this.setState(prevState => ({ isModalVisible: !prevState["isModalVisible"] })); }
	render() {
		const { width } = Dimensions.get('window');
		const { isModalVisible } = this.state;
		return (
			<ScrollView style={{ flex: 1, backgroundColor: "#FFFFFF", borderTopColor: "#63E2F7", borderTopWidth: 2, }}>
				<ImageBackground source={(this.props["navigation"].getParam("type") === "profesional") ? require('../assets/iconos/banner-fixperto.png') : require('../assets/iconos/banner-fixperto.png')}
					style={{ justifyContent: "center", paddingVertical: 80, }}
					imageStyle={{ resizeMode: "cover", width }} >
					<View style={{ flex: 1, alignSelf: "center", marginLeft: -30 }}>
						<Text style={{ color: "white", fontFamily: "Raleway-Bold", width: 160, fontSize: 19, position: "absolute", marginTop: -45, }}>Conoce las ventajas de ser parte de nuestra red de fixpertos</Text>
					</View>
				</ImageBackground>
				<Modal isVisible={isModalVisible}>
					<View style={{ marginHorizontal: 10, marginVertical: 25, alignItems: "center" }}>
						<Ionicons name="ios-close" size={40} color="#FFFFFF" onPress={this.toggleModal} />
						<Video
							source={{ uri: url + "/video/fixperto_beneficios.mp4" }}
							volume={1.0}
							shouldPlay
							isMuted={false}
							isLooping
							resizeMode="contain"
							useNativeControls={true}
							style={{ width: width - 10, height: width }}
						/>
					</View>
				</Modal >
				<Button title="Así funciona fixperto" buttonStyle={{ borderRadius: 7, borderWidth: 1, borderColor: "#63E2F7", display: "flex" }} type="outline"
					titleStyle={{ color: "#36425C", fontFamily: "Raleway-Bold", marginLeft: 25, fontSize: 20, flex: 1 }}
					containerStyle={{ marginHorizontal: 20, marginTop: 20, borderWidth: 1, borderColor: "#61A4BA" }}
					icon={
						<Image source={require("../assets/iconos/play.png")} style={{ width: 30, height: 30, justifyContent: "flex-start", marginLeft: 10 }} />
					}
					onPress={this.toggleModal}
				/>
				<Text style={{ fontFamily: "Raleway-Bold", color: "#36425C", fontSize: 18, marginTop: 10, marginBottom: 10, textAlign: "center", marginHorizontal: 20 }}>Como empresa tenemos un compromiso con el país.</Text>
				<Text style={{ color: "#36425C", fontSize: 18, marginHorizontal: 20, }}>Nuestro enfoque es el crecimiento socioeconómico de nuestros ﬁxpertos.</Text>
				<View style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 20 }}>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<Icon name="check" size={16} color="#63E2F7" />
						<Text style={{ marginStart: 10, flex: 0.9, fontSize: 16, }}>No hacemos retención porcentual de los costos de tus servicios.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<Icon name="check" size={16} color="#63E2F7" />
						<Text style={{ marginStart: 10, flex: 0.9, fontSize: 16, }}>No te exigimos horario ni zonas de prestación del servicio.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<Icon name="check" size={16} color="#63E2F7" />
						<Text style={{ marginStart: 10, flex: 0.9, fontSize: 16 }}>Te capacitaremos para aumentar tus conocimientos y competencias.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<Icon name="check" size={16} color="#63E2F7" />
						<Text style={{ marginStart: 10, flex: 0.9, fontSize: 16 }}>Puedes activar diferentes categorías de servicio de forma ilimitada.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<Icon name="check" size={16} color="#63E2F7" />
						<Text style={{ marginStart: 10, flex: 0.9, fontSize: 16 }}>El cliente te calificará por servicio realizado lo que permitirá posicionar tu perfil.</Text>
					</View>
					<View style={{ flexDirection: "row", marginBottom: 10 }}>
						<Icon name="check" size={16} color="#63E2F7" />
						<Text style={{ marginStart: 10, flex: 0.9, fontSize: 16 }}>Te podrás contactar directamente con tu posible cliente.</Text>
					</View>
				</View>
				<Button title="INICIAR REGISTRO" buttonStyle={buttons.primary}
					titleStyle={buttons.PrimaryText}
					containerStyle={{}}
					onPress={this.iniciarRegistro}
				/>
			</ScrollView >
		)
	}
}