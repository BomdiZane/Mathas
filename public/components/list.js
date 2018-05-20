import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const List = ({ states }) => {
    let items = [],
        index = 0;
    states.forEach(state => {
        items.push(<li key={ index++ }>{ state }</li>);
    });
    return <ol>{ items }</ol>;
};

List.propTypes = {
    states: PropTypes.array.isRequired,
};

export default List;