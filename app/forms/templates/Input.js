import React from 'react';
import { Styles, View } from 'react-native';
import { Import, Icon } from 'react-native-elements';

export default (inputTemplate = locals => {
    return (
        <View>
            <Input placeholder="Test..." />
        </View>
    )
});

const styles = StyleSheet.create({});