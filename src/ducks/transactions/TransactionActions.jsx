/**
 * Is used in both TransactionActionMenu and TransactionMenu
 * to show possible actions related to a transaction.
 *
 * The TransactionAction (the action the user is most susceptible
 * to need) can also be shown in desktop mode, directly in the
 * table.
 */

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Icon, MenuItem, withBreakpoints } from 'cozy-ui/react'
import palette from 'cozy-ui/stylus/settings/palette.json'
import { findMatchingActions } from './actions'

// TODO delete or rename this variable (see https://gitlab.cozycloud.cc/labs/cozy-bank/merge_requests/237)
const PRIMARY_ACTION_COLOR = palette.dodgerBlue

const MenuIcon = withBreakpoints()(({action, transaction, actionProps, color, breakpoints: { isDesktop }}) => {
  if (action.getIcon) {
    return action.getIcon({ action, transaction, actionProps })
  }
  return <Icon icon={action.icon} color={color} />
})

const MenuAction = ({ action, transaction, actionProps, className }) => {
  const { Component } = action
  const color = action.disabled ? palette.charcoalGrey : action.color || actionProps.color || PRIMARY_ACTION_COLOR
  const displayComponent = actionProps.onlyIcon !== true
  return (
    <MenuItem
      className={className}
      disabled={action.disabled}
      onClick={actionProps.onClick}
      icon={<MenuIcon action={action} transaction={transaction} actionProps={actionProps} color={color} />}
    >
      {displayComponent && <Component action={action} transaction={transaction} actionProps={actionProps} color={color} />}
    </MenuItem>
  )
}

class TransactionActions extends Component {
  state = {
    actions: false,
    actionProps: false
  }

  async componentDidMount () {
    const { transaction } = this.props
    if (transaction) {
      const { urls, brands, bill } = this.props
      const actionProps = { urls, brands, bill }
      const actions = await findMatchingActions(transaction, actionProps)
      this.setState({actions, actionProps})
    }
  }

  componentDidUpdate (nextProps) {
    if (nextProps.urls !== this.props.urls || nextProps.brands !== this.props.brands || nextProps.bill !== this.props.bill) {
      this.componentDidMount()
    }
  }

  render () {
    const { displayDefaultAction, onlyDefault, onlyIcon, transaction } = this.props
    const { actions, actionProps } = this.state

    if (!actions) return
    if (onlyIcon) {
      actionProps.onlyIcon = onlyIcon
    }

    return (
      <span>
        {(displayDefaultAction || onlyDefault) && actions.default &&
          <MenuAction action={actions.default} transaction={transaction} actionProps={actionProps} className={onlyDefault || onlyIcon ? 'u-p-0' : ''} />
        }
        {!onlyDefault && actions.others.map(action => (
          <MenuAction action={action} transaction={transaction} actionProps={actionProps} />
        ))}
      </span>
    )
  }
}

TransactionActions.propTypes = {
  transaction: PropTypes.object.isRequired,
  urls: PropTypes.object.isRequired,
  brands: PropTypes.array.isRequired,
  withoutDefault: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onSelectDisabled: PropTypes.func.isRequired
}

export default TransactionActions
