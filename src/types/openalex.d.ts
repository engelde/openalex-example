// 	Title of work
// 	Type of work
// 	Language
// 	Date of publication
// 	Times cited
// 	Link to work (landing_page_url)

export type Author = {
  id: string
  display_name: string
}

export type Work = {
  id: string
  title: string
  type: string
  language: string
  publication_date: string
  publication_year: string
  cited_by_count: number
}

export type Pagination = {
  count: number
  db_response_time_ms: number
  groups_count: number | null
  page: number
  per_page: number
}
