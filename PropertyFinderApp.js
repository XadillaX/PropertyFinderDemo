/**
 * XadillaX created at 2015-08-06 16:28:22 With ♥
 *
 * Copyright (c) 2015 Huaban.com, all rights
 * reserved.
 */
var React = require("react-native");
var SearchPage = require("./SearchPage");

var styles = React.StyleSheet.create({
    text: {
        color: "black",
        backgroundColor: "white",
        fontSize: 30,
        margin: 80
    },

    container: {
        flex: 1
    }
});

class HelloWorld extends React.Component {
    render() {
        return <React.Text style={styles.text}>Hello world (again)</React.Text>;
    }
};

class PropertyFinderApp extends React.Component {
    render() {
        return (
            <React.NavigatorIOS
                style={styles.container}
                initialRoute={{
                    title: "Property Finder",
                    component: SearchPage
                }} />
        );
    }
};

React.AppRegistry.registerComponent("PropertyFinder", function() {
    return PropertyFinderApp;
});
