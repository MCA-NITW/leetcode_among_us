import {
  fetchOptimizedUserData,
  fetchBatchUserData,
  processUserDataResponse
} from '../api/OptimizedFetchData'

import type { LeetcoderEntry, UserData } from '../types'

interface ProgressInfo {
  progress: number
  currentlyProcessing: string
}

interface ProgressState {
  completedUsers: number
  totalUsers: number
}

// Legacy function for backward compatibility - now uses optimized backend
export const fetchDataForLeetcoder = async (
  leetcoder: Partial<LeetcoderEntry>
): Promise<Partial<UserData>> => {
  if (!leetcoder.userName || leetcoder.userName.trim() === '') {
    console.warn(`No userName provided for leetcoder with ID: ${leetcoder.id}`)
    return leetcoder as Partial<UserData>
  }

  try {
    const backendData = await fetchOptimizedUserData(leetcoder.userName)
    return processUserDataResponse(leetcoder, backendData) as Partial<UserData>
  } catch (error) {
    console.error('Error fetching data for user:', leetcoder.userName, error)
    return leetcoder as Partial<UserData>
  }
}

// Helper to process a batch individually when batch API fails
const processBatchIndividually = async (
  batch: Partial<LeetcoderEntry>[],
  allResults: Partial<UserData>[],
  progressState: ProgressState,
  onProgress?: (info: ProgressInfo) => void
): Promise<void> => {
  for (const leetcoder of batch) {
    try {
      onProgress?.({
        progress:
          (progressState.completedUsers / progressState.totalUsers) * 100,
        currentlyProcessing: `Processing: ${leetcoder.userName}`
      })

      const result = await fetchDataForLeetcoder(leetcoder)
      allResults.push(result)
      progressState.completedUsers++
    } catch (individualError) {
      console.error(`Error processing ${leetcoder.userName}:`, individualError)
      allResults.push(leetcoder as Partial<UserData>)
      progressState.completedUsers++
    }
  }
}

// Function to fetch data with progress tracking
export const fetchDataWithProgress = async (
  leetcoders: Partial<LeetcoderEntry>[],
  onProgress?: (info: ProgressInfo) => void
): Promise<Partial<UserData>[]> => {
  const validLeetcoders = leetcoders.filter(
    leetcoder => leetcoder.userName && leetcoder.userName.trim() !== ''
  )

  if (validLeetcoders.length === 0) {
    return []
  }

  const batchSize = 10
  const batches: Partial<LeetcoderEntry>[][] = []

  for (let i = 0; i < validLeetcoders.length; i += batchSize) {
    batches.push(validLeetcoders.slice(i, i + batchSize))
  }

  const allResults: Partial<UserData>[] = []
  const progressState: ProgressState = {
    completedUsers: 0,
    totalUsers: validLeetcoders.length
  }

  for (const batch of batches) {
    try {
      // Update progress with current batch
      const batchUsernames = batch.map(user => user.userName).join(', ')
      onProgress?.({
        progress: (progressState.completedUsers / validLeetcoders.length) * 100,
        currentlyProcessing: `Processing: ${batchUsernames}`
      })

      const usernames = batch.map(user => user.userName!.toLowerCase())
      const batchResults = await fetchBatchUserData(usernames)

      // Process each result
      const processedBatch = batch.map((leetcoder, index) => {
        const backendData = batchResults[index]
        if (backendData?.success && backendData.data) {
          return processUserDataResponse(
            leetcoder,
            backendData.data
          ) as Partial<UserData>
        } else {
          console.warn(`Failed to fetch data for ${leetcoder.userName}`)
          return leetcoder as Partial<UserData>
        }
      })

      allResults.push(...processedBatch)
      progressState.completedUsers += batch.length

      // Update progress
      onProgress?.({
        progress: (progressState.completedUsers / validLeetcoders.length) * 100,
        currentlyProcessing: `Completed: ${progressState.completedUsers}/${validLeetcoders.length}`
      })
    } catch (error) {
      console.error('Error processing batch:', error)
      // Fallback to individual processing for this batch
      await processBatchIndividually(
        batch,
        allResults,
        progressState,
        onProgress
      )
    }
  }

  onProgress?.({
    progress: 100,
    currentlyProcessing: 'Complete!'
  })

  return allResults
}
