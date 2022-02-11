import CircularProgress from '@mui/material/CircularProgress';
import { useContext, useMemo } from 'react';
import { Greetings, WeeklyStats } from '../components/atoms';
import {
  BlankState,
  MainMenu,
  MealsBarChart,
  WeeklyUserStatsBarChart,
} from '../components/molecules';
import {
  AddMeal,
  DeleteMeal,
  InviteFriend,
  Meals,
  UpdateMeal,
} from '../components/organisms';
import { mealPeriods } from '../enum/mealPeriods';
import { useMainMenu } from '../hooks/useMainMenu';
import { useMealActions } from '../hooks/useMealActions';
import { useToast } from '../hooks/useToast';
import { useUserMeals } from '../hooks/useUserMeals';
import { AuthContext } from '../store/AuthProvider';

const formatMealsForChart = (meals?: any[], withUsers?: boolean) =>
  meals
    ?.slice(0, 7)
    ?.reverse()
    ?.map(({ day, total, entries }: any) => ({
      day,
      calories: total,
      meals: entries.length,
      users: withUsers
        ? new Set(entries.map(({ author }: any) => author?.name)).size
        : null,
    })) ?? [];

const getDailyCalories = (meals?: any[]): number =>
  meals?.find(
    ({ day }: { day: string }) => day === new Date().toISOString().slice(0, 10),
  )?.total ?? 0;

const UserMeals = () => {
  const { isAdmin } = useContext(AuthContext);

  const { openToast, toast } = useToast();

  const {
    menuActions,
    closeAddMeal,
    isAddMealOpen,
    closeInviteFriend,
    isInviteFriendOpen,
  } = useMainMenu();

  const {
    updateMeal,
    deleteMeal,
    mealToDelete,
    mealToUpdate,
    closeDeleteMeal,
    closeUpdateMeal,
  } = useMealActions();

  const blankStateAction = useMemo(
    () =>
      menuActions.find(
        ({ id }) => id === (isAdmin ? 'inviteFriend' : 'addMeal'),
      )?.action,
    [menuActions, isAdmin],
  );

  const { data, isLoading } = useUserMeals(mealPeriods.DAY);

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <>
      <Greetings
        isEmpty={!data.total}
        dailyCalories={getDailyCalories(data.entries)}
      />

      {!data.total ? (
        <BlankState action={blankStateAction} />
      ) : (
        <>
          {isAdmin && (
            <>
              <WeeklyStats stats={data.stats} />

              <WeeklyUserStatsBarChart stats={data.stats} />
            </>
          )}

          <MealsBarChart data={formatMealsForChart(data.entries, isAdmin)} />
        </>
      )}

      <Meals
        meals={data.entries ?? []}
        updateMeal={updateMeal}
        deleteMeal={deleteMeal}
      />

      <MainMenu actions={menuActions} />

      <InviteFriend
        onInviteFriend={openToast}
        isOpen={isInviteFriendOpen}
        close={closeInviteFriend}
      />

      <AddMeal
        onAddMeal={openToast}
        isOpen={isAddMealOpen}
        close={closeAddMeal}
      />

      <UpdateMeal
        unselectMeal={closeUpdateMeal}
        onUpdateMeal={openToast}
        meal={mealToUpdate}
      />

      <DeleteMeal
        unselectMeal={closeDeleteMeal}
        onDeleteMeal={openToast}
        meal={mealToDelete}
      />

      {toast}
    </>
  );
};

export default UserMeals;
