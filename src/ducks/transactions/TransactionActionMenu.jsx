/**
 * Is used in mobile/tablet mode when you click on the more button
 */

import React, { Component } from 'react'
import cx from 'classnames'
import { translate, Icon, ActionMenu } from 'cozy-ui/react'
import { withDispatch } from 'utils'
import { flowRight as compose } from 'lodash'

import { Media, Bd, Img } from 'components/Media'
import { Figure } from 'components/Figure'
import { getLabel } from 'ducks/transactions'
import CategoryIcon from 'ducks/categories/CategoryIcon'
import { getParentCategory, getCategoryName } from 'ducks/categories/categoriesMap'
import styles2 from 'ducks/transactions/Transactions.styl'
import TransactionActions from 'ducks/transactions/TransactionActions'
import { withUpdateCategory } from 'ducks/categories'
import palette from 'cozy-ui/stylus/settings/palette.json'
import { updateDocument } from 'cozy-client'
import edit from 'assets/icons/icon-edit.svg'
import PropTypes from 'prop-types'
import flash from 'ducks/flash'

const showComingSoon = (t) => {
  flash(t('ComingSoon.description'))
}

class TransactionActionMenu extends Component {
  render () {
    const { t, f, transaction, urls, requestClose } = this.props
    const { showCategoryChoice } = this.props
    const category = getParentCategory(transaction.categoryId)
    const onSelect = () => requestClose()
    const onSelectDisabled = () => { showComingSoon(t); requestClose() }
    return (
      <ActionMenu onClose={requestClose}>
        <Media className='u-ph-1 u-pv-half'>
          <Bd>
            <h3 className='u-m-0 u-mb-half'>{getLabel(transaction)}</h3>
            <span>{f(transaction.date, 'dddd DD MMMM - h[h]mm')}</span>
          </Bd>
          <Img>
            <Figure
              total={transaction.amount}
              currency={transaction.currency}
              signed
              coloredPositive
            />
          </Img>
        </Media>
        <hr className='u-mv-0' />
        <Media className='u-ph-1 u-pv-half u-hover' onClick={showCategoryChoice}>
          <Img>
            <CategoryIcon category={category} />
          </Img>
          <Bd className='u-pl-1 u-ellipsis'>
            {t(`Data.subcategories.${getCategoryName(transaction.categoryId)}`)}
          </Bd>
          <Img className='u-pl-1'>
            <Icon icon={edit} color={palette['coolGrey']} />
          </Img>
        </Media>
        <hr />
        <TransactionActions
          onSelect={onSelect}
          onSelectDisabled={onSelectDisabled}
          transaction={transaction}
          urls={urls} />
      </ActionMenu>
    )
  }
}

const updateCategoryParams = {
  updateCategory: (props, category) => {
    const { dispatch, transaction } = props
    transaction.categoryId = category.id
    dispatch(updateDocument(transaction))
  },
  getCategoryId: ownProps => ownProps.transaction.categoryId
}

TransactionActionMenu.propTypes = {
  showCategoryChoice: PropTypes.func.isRequired,
  requestClose: PropTypes.func.isRequired
}

export default compose(
  withDispatch,
  withUpdateCategory(updateCategoryParams),
  translate()
)(TransactionActionMenu)
