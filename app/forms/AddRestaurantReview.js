import React, { PureComponent } from "react";
import t from "tcomb-form-native";
import inputTemplate from "./templates/Input";
import textareaTemplate from "./templates/TextArea";

export const AddRestaurantReviewStruct = t.struct({
  title: t.String,
  review: t.String
});

export const AddRestaurantReviewOptions = {
  fields: {
    title: {
      template: inputTemplate,
      config: {
        placeholder: "Título de la opinión",
        iconType: "material-community",
        iconName: "silverware"
      }
    },
    review: {
      template: textareaTemplate,
      config: {
        placeholder: "Opinión"
      }
    }
  }
};
