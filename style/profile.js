import { StyleSheet } from 'react-native';

const estandar = StyleSheet.create ({
    texto : {
        fontFamily : 'Raleway-Regular'
    }, 

    texto_bold : {
        fontFamily : 'Raleway-Bold'
    }
})

const general = StyleSheet.create ({
	container: {
		flex: 1, 
        backgroundColor: "#FFFFFF"
	},

    container_img : {
        flexDirection: "row", 
        backgroundColor : "#f8f8f8",
        paddingBottom:30,
        paddingTop : 15
    },

    container2: {
        flexDirection: "row", 
        justifyContent: "center", 
        marginVertical: 5
    },

    container3 : {
        flex: 0.75, 
        justifyContent: "center",
    },

    container4 :{
        borderTopWidth: 0.5, 
        borderTopColor: "#E0E0E0"
    }
})

const info = StyleSheet.create ({
    container_img_profile : {
        flex: 0.25, 
        borderRadius: 5, 
        alignItems: "center", 
        marginVertical: 5
    },

    cont_img_profile_img : {
        width: 120, 
        height: 120,
        borderRadius : 20
    },

    img_profile_button : {
        borderColor: "#42AECB", 
        marginRight: 5, 
        padding: 3,
        backgroundColor : "#effbff",
        borderRadius : 5
    },

    title_buton : {                       
        color: "#42AECB", 
        fontFamily: "Raleway-Bold", 
        fontSize: 14
    },

    icon_button : {
        marginHorizontal: 5, 
        color : "#42AECB" 
    },

    text_welcome : {
        marginBottom: 5,
        fontSize : 25,
        color : "#273861"
    },

    text_fixperto : {
        marginBottom: 5,
        fontSize: 16
    },

    seccion_perfil : {
        flexDirection: "row", 
        alignItems: "center",
        padding : 15
    },

    seccion_perfil_img : {
        width: 25, 
        height: 25
    },

    seccion_perfil_text : {
        fontFamily : "Raleway-Bold",
        marginStart: 5, 
        fontSize: 17,
        color : "#273861",
    },

    icon_sub_seccion : {
        marginHorizontal: 5,
        color : "#42AECB",
        fontSize : 30,
        fontFamily : "Raleway-Bold" 
    },

    container_button : {
        marginHorizontal: 20, 
        marginVertical: 10,
    },

    button_close_sesion:{
        borderColor: "#CE4343", 
        borderWidth: 2
    },

    title_button_close : {
        color: "#CE4343", 
        fontFamily: "Raleway-Bold"
    },

    /*******EXPERTO********/ 

    cont_compra_plan : {
        flexDirection: "row", 
        marginHorizontal: 20, 
        marginVertical: 10, 
        borderWidth: 0.5, 
        borderRadius: 7, 
        borderColor: "#F96511",
    },

    cont_compra_plan : {
        flex: 0.3, 
        borderRadius: 5, 
        alignItems: "center", 
        justifyContent: "center"
    },

    cont_compra_text : {
        backgroundColor: "#FFDCC9", 
        padding: 15, 
        justifyContent: "center", 
        flex: 0.7
    },

    cont_compra_text_det : {
        fontSize: 20, 
        fontFamily: "Raleway-Bold", 
        color: "#F96511"
    },

    cont_plan_actual : {
        flexDirection: "row", 
        marginHorizontal: 20, 
        marginVertical: 10, 
        borderWidth: 2, 
        borderRadius: 5, 
        borderColor: "#87CA3E"
    },

    cont_plan_img : {
        flex: 0.3, 
        borderRadius: 5, 
        alignItems: "center", 
        justifyContent: "center"
    },

    cont_plan_text : {
        backgroundColor: "#D9F4BB", 
        justifyContent: "center", 
        padding: 10, 
        flex: 0.7 
    },

    cont_subtitle : {
        flexDirection: "row", 
        marginTop: 20, 
        marginHorizontal: 10, 
        alignItems: "center", 
        justifyContent: "center"
    },

    cont_subtitle_text : {
        fontFamily: "Raleway-Bold", 
        marginStart: 10, 
        fontSize: 18,
        color : "#273861"
    }
})





export { estandar, general, info }; 

