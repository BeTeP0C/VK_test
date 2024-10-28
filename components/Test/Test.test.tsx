// import { render, screen, fireEvent, waitFor, within, act } from '@testing-library/react';
// import { UserStore } from './Test';
// import { Test } from './Test'; // Подставьте правильный путь к компоненту

// jest.mock('./Test', () => ({
//   ...jest.requireActual('./Test'),
//   UserStore: jest.fn().mockImplementation(() => ({
//     users: [],
//     isLoading: false,
//     startUser: 0,
//     isEditing: false,
//     editingUser: null,
//     inputLogin: "",
//     getUsers: jest.fn(), // Мокаем функцию getUsers
//     handleSave: jest.fn(),
//     handleEdit: jest.fn(),
//     handleDelete: jest.fn(),
//     changeStateUsers: () => Promise<void>
//   })),
// }));

// describe('Test component', () => {
//   beforeEach(() => {
//     if (typeof window !== 'undefined' && window.fetch) {
//       jest.spyOn(window, 'fetch').mockClear();
//     }
//   });

//   test("бла-бла", async () => {
//     const mockUsers = [
//       { login: "mojombo", avatar_url: "https://avatars.githubusercontent.com/u/1?v=4" },
//       { login: "defunkt", avatar_url: "https://avatars.githubusercontent.com/u/2?v=4" },
//     ];

//     const userStore = new UserStore() as UserStore; // Получаем моковый UserStore



//     jest.spyOn(userStore, 'getUsers').mockReturnValueOnce(Promise.resolve({
//       json: () => Promise.resolve(mockUsers),
//     }));

//     jest.spyOn(userStore, 'changeStateUsers').mockReturnValueOnce(Promise.resolve())

//     render(<Test />)

//     screen.debug()

//     await waitFor(() => {
//       const listItems = screen.findAllByRole('listitem');
//       expect(listItems).toHaveLength(2);
//       screen.debug()
//     }, {
//       timeout: 3000,
//     });

//     screen.debug()

//     // const userlist = await waitFor(() => screen.getByRole("userlist"))
//     // expect(userlist).toBeInTheDocument()
//   })
// });
