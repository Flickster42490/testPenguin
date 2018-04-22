// Libs
import React from "react";
import FontAwesome from "react-fontawesome";

export function Preloader(props) {
  const preloadStyles = {
    height: props.preloadHeight,
    width: props.preloadWidth,
    borderWidth: props.preloadStroke,
    borderLeftColor: props.preloadColor
  };
  if (props.loading) {
    return (
      <div className="preloader" style={preloadStyles}>
        <FontAwesome name="spinner" spin size="4x" />
      </div>
    );
  }

  if (props.children) {
    return <div>{props.children}</div>;
  }

  return <div />;
}

export function PreloaderView(props) {
  if (props.loading) {
    return (
      <div className="preloader-fullpage">
        <div className="preloader" />
      </div>
    );
  }

  if (props.children) {
    return <div>{props.children}</div>;
  }

  return <div />;
}
