import React from "react";
import styles from "../styles/Pentagon.module.css";

export const PentagonDesign = ({
  execute,
}: {
  execute: (val: string) => void;
}) => {
  return (
    <div className={styles.pentagon}>
      <button className={styles.pentagonButton} onClick={() => execute("1")}>
        Rock
      </button>
      <button className={styles.pentagonButton} onClick={() => execute("2")}>
        Paper
      </button>
      <button className={styles.pentagonButton} onClick={() => execute("3")}>
        Scissor
      </button>
      <button className={styles.pentagonButton} onClick={() => execute("4")}>
        Spock
      </button>
      <button className={styles.pentagonButton} onClick={() => execute("5")}>
        Lizard
      </button>
    </div>
  );
};
