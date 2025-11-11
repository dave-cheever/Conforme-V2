/**
 * Returns an array of filter names that should be hidden in panel view
 * @param moduleType - The type of module ('audits' or 'tracker')
 * @param pathname - The current pathname
 * @returns Array of filter names to hide
 */
export function getFiltersToHideInPanelView(moduleType: string | undefined, pathname: string): string[] {
  const pathSegments = pathname.split('/').filter(Boolean);
  const isDashboard = pathname.endsWith('/dashboard') && pathSegments.length === 2;

  // Use module type to determine if we're on audits or tracker page
  const isAuditsPage = moduleType === 'audits' && (
    pathname === '/audits' || 
    (pathname.startsWith('/audits') && pathSegments.length === 1) ||
    isDashboard
  );
  
  const isTrackerPage = moduleType === 'tracker' && (
    isDashboard ||
    pathname.includes('tracker-items') || 
    (pathname.includes('tracker-item') && !/\/tracker-item\/[^/]+$/.exec(pathname))
  );

  // For audits panel view, hide filters not shown in panel
  if (isAuditsPage) {
    return ['walkType', 'locationsIds', 'businessUnitsIds', 'createdDate', 'showArchived'];
  }

  // For tracker items panel view, hide filters not shown in panel
  if (isTrackerPage) {
    return ['locationsIds', 'regulatoryBodiesIds'];
  }

  return [];
}

/**
 * Returns true if a filter should be hidden in panel view (including custom question filters for tracker)
 * @param filterName - The name of the filter
 * @param moduleType - The type of module ('audits' or 'tracker')
 * @param pathname - The current pathname
 * @returns True if the filter should be hidden
 */
export function shouldHideFilterInPanelView(filterName: string, moduleType: string | undefined, pathname: string): boolean {
  const hiddenFilters = getFiltersToHideInPanelView(moduleType, pathname);
  
  // For tracker items, also hide custom question filters
  const pathSegments = pathname.split('/').filter(Boolean);
  const isDashboard = pathname.endsWith('/dashboard') && pathSegments.length === 2;
  const isTrackerPage = moduleType === 'tracker' && (
    isDashboard ||
    pathname.includes('tracker-items') || 
    (pathname.includes('tracker-item') && !/\/tracker-item\/[^/]+$/.exec(pathname))
  );

  if (isTrackerPage) {
    const standardFilters = ['trackerItemsIds', 'categoriesIds', 'usersIds', 'locationsIds', 'businessUnitsIds', 'itemStatus', 'regulatoryBodiesIds', 'dueDate'];
    if (!standardFilters.includes(filterName)) {
      return true; // Hide custom question filters
    }
  }

  return hiddenFilters.includes(filterName);
}

