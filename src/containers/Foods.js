// NPM Imports
import { connect } from 'react-redux';
import React, { Component } from 'react';
import {
  Col,
  Card,
  Input,
  Modal,
  Alert,
  Button,
  CardBody,
  Container,
  ModalBody,
  CardTitle,
  InputGroup,
  ModalFooter,
  ModalHeader,
  CardSubtitle,
  InputGroupText,
  InputGroupAddon
} from 'reactstrap';
// Local Imports
import * as actions from '../actions';

class Foods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: false,
      success: false,
      newFoodName: '',
      newFoodCalories: '',
      showFoodModal: false,
      selectedFoodIndex: 0,
      selectedFoodGrams: 0
    };
    this.onSave = this.onSave.bind(this);
    this.dismissError = this.dismissError.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.dismissSuccess = this.dismissSuccess.bind(this);
    this.toggleFoodModal = this.toggleFoodModal.bind(this);
    this.onChangeCalories = this.onChangeCalories.bind(this);
    this.onChangeGramsFood = this.onChangeGramsFood.bind(this);
    this.onSubmitSelectedFood = this.onSubmitSelectedFood.bind(this);
  }

  componentWillMount() {
    this.props.dispatch({ type: actions.FETCH_FOODS });
  }

  onSubmitSelectedFood() {
    const { foods, consumedCalories } = this.props;
    const { selectedFoodGrams, selectedFoodIndex } = this.state;
    const newCalories = selectedFoodGrams * foods[selectedFoodIndex].calories;
    const totalCalories = newCalories + consumedCalories;
    this.props.dispatch({
      type: actions.UPDATE_CALORIES,
      payload: totalCalories
    });
    this.toggleFoodModal(0);
  }

  onChangeGramsFood({ target }) {
    this.setState({ selectedFoodGrams: target.value });
  }

  toggleFoodModal(index) {
    this.setState({
      selectedFoodGrams: 0,
      selectedFoodIndex: index,
      showFoodModal: !this.state.showFoodModal
    });
  }

  onDelete(_id) {
    this.props.dispatch({ type: actions.DELETE_FOOD, payload: _id });
  }

  onSave() {
    const { newFoodName, newFoodCalories } = this.state;
    if (!newFoodName || !newFoodCalories) {
      return this.setState({ error: true, success: false });
    }
    const newFood = { name: newFoodName, calories: newFoodCalories };
    this.setState({
      error: false,
      success: true,
      newFoodName: '',
      newFoodCalories: ''
    });
    this.props.dispatch({ type: actions.ADD_FOOD, payload: newFood });
  }

  onChangeName({ target }) {
    this.setState({ newFoodName: target.value });
  }

  onChangeCalories({ target }) {
    this.setState({ newFoodCalories: target.value });
  }

  dismissError() {
    this.setState({ error: false });
  }

  dismissSuccess() {
    this.setState({ success: false });
  }

  render() {
    const { foods } = this.props;
    const { error, success, selectedFoodIndex } = this.state;
    const calculatedFood =
      foods.length > 0
        ? this.state.selectedFoodGrams * foods[selectedFoodIndex].calories
        : 0;
    return (
      <Container>
        <Col sm="12">
          <AddFoodsSection
            {...this.state}
            onSave={this.onSave}
            onChangeName={this.onChangeName}
            onChangeCalories={this.onChangeCalories}
            consumedCalories={this.props.consumedCalories}
          />
        </Col>
        <Modal
          isOpen={this.state.showFoodModal}
          toggle={() => this.toggleFoodModal(0)}
          className="mt-5 text-dark"
        >
          <ModalHeader toggle={() => this.toggleFoodModal(0)}>
            {foods.length > 0 ? foods[selectedFoodIndex].name : null}
          </ModalHeader>
          <ModalBody>
            <p className="text-center">{`${calculatedFood} kCal`}</p>
            <InputGroup>
              <InputGroupAddon addonType="prepend">
                <InputGroupText>Grams:</InputGroupText>
              </InputGroupAddon>
              <Input
                type="number"
                onChange={this.onChangeGramsFood}
                value={this.state.selectedFoodGrams}
              />
            </InputGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={() => this.toggleFoodModal(0)}>
              Cancel
            </Button>
            <Button color="primary" onClick={this.onSubmitSelectedFood}>
              Save
            </Button>
          </ModalFooter>
        </Modal>
        <Col sm="12">
          <Alert color="danger" isOpen={error} toggle={this.dismissError}>
            Brah, error in input values...
          </Alert>
          <Alert color="success" isOpen={success} toggle={this.dismissSuccess}>
            Brah, change saved!
          </Alert>
        </Col>
        {foods.length > 0 &&
          foods.map((food, index) => (
            <Col key={index} sm="6" className="mb-3">
              <Card className="texft-center">
                <div
                  className="my-3"
                  style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  <span className="text-center text-dark">
                    <span>Name:</span>
                    <br />
                    <span>{food.name}</span>
                  </span>
                  <span className="text-center text-dark">
                    <span>Calories:</span>
                    <br />
                    <span>{food.calories} /g</span>
                  </span>
                </div>
                <div
                  className="mb-3"
                  style={{ display: 'flex', justifyContent: 'space-around' }}
                >
                  <Button
                    outline
                    color="danger"
                    className="mx-4"
                    onClick={() => this.onDelete(food._id)}
                  >
                    Delete
                  </Button>
                  <Button
                    outline
                    color="primary"
                    className="mx-4"
                    onClick={() => this.toggleFoodModal(index)}
                  >
                    Select
                  </Button>
                </div>
              </Card>
            </Col>
          ))}
      </Container>
    );
  }
}

const AddFoodsSection = ({
  newFoodName,
  newFoodCalories,
  consumedCalories,
  onSave,
  onChangeName,
  onChangeCalories
}) => (
  <Card className="text-center mb-3">
    <CardBody>
      <CardTitle className="text-dark">Add Food</CardTitle>
      <CardSubtitle className="text-dark my-2">
        Consumed: {consumedCalories}
      </CardSubtitle>
      <input
        className="mt-1 mb-1"
        type="string"
        placeholder="Name"
        value={newFoodName}
        onChange={onChangeName}
      />
      <br />
      <input
        className="m-3 mb-4"
        type="number"
        placeholder="kCal /g"
        value={newFoodCalories}
        onChange={onChangeCalories}
      />
      <br />
      <Button color="primary" onClick={onSave}>
        Save
      </Button>
    </CardBody>
  </Card>
);

const mapStateToProps = state => {
  return {
    foods: state.food.items,
    consumedCalories: state.auth.consumedCalories
  };
};

export default connect(mapStateToProps)(Foods);
