import React, { Component } from 'react';
import { Text, View, Image, Dimensions } from 'react-native';
import Modal from "react-native-modal";
export default class CargadorVista extends Component {
    constructor(props) { super(props); }
    render() {
        const { width, height } = Dimensions.get('window');
        return (
            <Modal isVisible={this.props["show"]} style={{ margin: 0 }} animationInTiming={10}>
                <View style={{ flex: 1, backgroundColor: "#1B263D", alignItems: "center", justifyContent: "center" }}>
                    <Image source={require("../assets/fondo.gif")} style={{ width, height: 250 }} />
                    <Text style={{ textAlign: "center", fontFamily: "Raleway-Bold", color: "#FFFFFF", fontSize: 20, padding: 20 }}>{(this.props["texto"]) ? this.props["texto"] : "CARGANDO..."}</Text>
                </View>
            </Modal>
        )
    }
}