import React from "react";
import classes from "./SkeletonIcon.module.css";

export default function SkeletonIcon({
  icon: Icon,
  width = "70px",
  height = "70px",
  loading = true,
  duration = 3,
}) {
  if (loading) {
    return (
      <div className={classes.graphic}>
        <span>
          <svg width={width} height={height}>
            <Icon />
          </svg>
          <div className={classes.afterElement} />
        </span>
      </div>
    );
  } else {
    return (
      <svg width={width} height={height}>
        <Icon />
      </svg>
    );
  }
}
