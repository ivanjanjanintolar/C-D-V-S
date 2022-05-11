import React from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import PropTypes from 'prop-types'
import { CBadge, CNavItem, CNavLink } from '@coreui/react'
import { axios } from 'src/config'
import { atom, useRecoilState } from 'recoil'

export const activeTemplateIdStateAtom = atom({ key: 'activeTemplate', default: null })

export const templatesStateAtom = atom({
  key: 'templates',
  default: [],
})

export const sharedTemplateState = []

export const AppSidebarNav = ({ items }) => {
  const location = useLocation()
  const [templates, setTemplates] = useRecoilState(templatesStateAtom)
  const [activeTemplateId, setActiveTemplateId] = useRecoilState(activeTemplateIdStateAtom)
  const fetchTemplates = async () => {
    const response = await axios.get('templates?sort=id,ASC')

    if (response && response.data) {
      setTemplates(
        response.data.map(({ x, y, width, height, ...rest }) => ({
          x: +x,
          y: +y,
          width: +width,
          height: +height,
          ...rest,
        })),
      )
    }
  }

  React.useEffect(() => {
    fetchTemplates()
  }, [])

  const setActiveTemplate = (template) => {
    setActiveTemplateId(template.id)
  }

  const navLink = (name, icon, badge) => {
    return (
      <>
        {icon && icon}
        {name && name}
        {badge && (
          <CBadge color={badge.color} className="ms-auto">
            {badge.text}
          </CBadge>
        )}
      </>
    )
  }

  const navItem = (item, index) => {
    const { component, name, badge, icon, ...rest } = item
    const Component = component
    return (
      <Component
        {...(rest.to &&
          !rest.items && {
            component: NavLink,
            activeClassName: 'active',
          })}
        key={index}
        {...rest}
      >
        {navLink(name, icon, badge)}
      </Component>
    )
  }
  const navGroup = (item, index) => {
    const { component, name, icon, to, ...rest } = item
    const Component = component
    return (
      <Component
        idx={String(index)}
        key={index}
        toggler={navLink(name, icon)}
        visible={location.pathname.startsWith(to)}
        {...rest}
      >
        {templates.map((template) => (
          <>
            <CNavItem>
              <CNavLink
                href={`#/template`}
                key={template.id}
                active={template.id === activeTemplateId}
                onClick={() => setActiveTemplate(template)}
              >
                {template.name}
              </CNavLink>
            </CNavItem>
          </>
        ))}
      </Component>
    )
  }

  return (
    <React.Fragment>
      {items &&
        items.map((item, index) => (item.items ? navGroup(item, index) : navItem(item, index)))}
    </React.Fragment>
  )
}

AppSidebarNav.propTypes = {
  items: PropTypes.arrayOf(PropTypes.any).isRequired,
}
