import * as React from 'react';
import { useState } from 'react';
import { StyleSheet } from 'react-native';

import EditScreenInfo from '../components/EditScreenInfo';
import {
  Button,
  SectionList,
  Text,
  TextInput,
  View,
} from '../components/Themed';

type MyClassStudent = {
  id: number;
  name: string;
  email: string;
};

type MyClassSection = {
  title: string;
  data: MyClassStudent[];
};

const Item = ({ MyClassStudent }: any) => (
  <View style={styles.item}>
    <Text style={styles.itemTitle}>{MyClassStudent.name}</Text>
    <Text>ID: {MyClassStudent.id}</Text>
    <Text>{MyClassStudent.email}</Text>
  </View>
);

export default class MyClass extends React.Component<
  {},
  {
    text: string;
    sectionListData: MyClassSection[];
  }
> {
  constructor(props: {}) {
    super(props);

    this._onPressSubmitButton = this._onPressSubmitButton.bind(this);

    this.state = {
      text: '',
      sectionListData: [],
    };
  }

  _onPressSubmitButton() {
    this.setState({
      sectionListData: [
        {
          title: 'external',
          data: [
            {
              id: 15,
              name: 'Ashlan',
              email: 'ashlan@gmail.com',
            },
            {
              id: 9,
              name: 'Clem',
              email: 'clem@gmail.com',
            },
          ],
        },
        {
          title: 'local',
          data: [
            {
              id: 7,
              name: 'Candice',
              email: 'candice@gmail.com',
            },
          ],
        },
      ],
    });
  }

  renderItem(item: MyClassStudent) {}

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Retrieve My Class</Text>
        <View style={styles.textInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Enter class code"
            onChangeText={(newText) => this.setState({ text: newText })}
          />
        </View>
        <View style={styles.buttonContainer}>
          <Button
            onPress={this._onPressSubmitButton}
            title="Submit"
            lightColor="#000"
            darkColor="rgba(255,255,255,0.1)"
          />
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Text style={styles.title}>My Class Information</Text>
        <View style={styles.sectionListContainer}>
          <SectionList
            sections={this.state.sectionListData}
            renderItem={({ item }) => <Item MyClassStudent={item} />}
            renderSectionHeader={({ section: { title } }) => (
              <Text style={styles.header}>{title}</Text>
            )}
          />
        </View>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <EditScreenInfo path="/screens/MyClassScreen.tsx" />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  textInputContainer: {
    width: '50%',
  },
  input: {
    height: 40,
    margin: 12,
    padding: 10,
    borderWidth: 1,
  },
  buttonContainer: {
    width: '50%',
  },
  sectionListContainer: {
    width: '80%',
  },
  header: {
    fontSize: 18,
    backgroundColor: '#fff',
    textTransform: 'capitalize',
  },
  item: {
    backgroundColor: '#ddd',
    padding: 20,
    marginVertical: 8,
  },
  itemTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});
