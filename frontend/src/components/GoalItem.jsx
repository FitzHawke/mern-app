import React from 'react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { deleteGoal, editGoal } from '../features/goals/goalSlice';

function GoalItem({ goal }) {
  const dispatch = useDispatch();

  useEffect(() => {

  },[goal.text])

  return (
    <div className="goal">
      <button onClick={() => dispatch(editGoal({id: goal._id, goalData: {text: 'test2'}}))}>
        E
      </button>
      <div>{new Date(goal.createdAt).toLocaleString('en-US')}</div>
      <h2>{goal.text}</h2>
      <button onClick={() => dispatch(deleteGoal(goal._id))} className="close">
        X
      </button>
    </div>
  );
}

export default GoalItem;
