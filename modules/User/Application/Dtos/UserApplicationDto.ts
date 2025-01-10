export interface UserApplicationDto {
  id: string
  name: string
  description: string
  username: string
  email: string
  imageUrl: string | null
  role: string
  viewsCount: number
  following: number
  followers: number
  publicLikes: boolean
  publicSaved: boolean
  publicShared: boolean
  publicProfile: boolean
  createdAt: string
  updatedAt: string
}
